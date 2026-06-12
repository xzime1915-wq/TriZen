import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyTitle } from "@/lib/blog";

const IMAGE_EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

function decodeEntities(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function metaContent(html: string, key: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${key}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1].trim());
  }
  return null;
}

/** Pick the main article region to reduce nav/footer noise. */
function articleRegion(html: string) {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0];
  if (article && article.length > 800) return article;
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0];
  if (main && main.length > 800) return main;
  return html;
}

function absoluteUrl(src: string, pageUrl: string) {
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) {
    try {
      return `${new URL(pageUrl).origin}${src}`;
    } catch {
      return src;
    }
  }
  return src;
}

type Block =
  | { type: "h"; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string }
  | { type: "img"; url: string };

/** Extract ordered article blocks: headings, paragraphs, list items, images. */
function extractBlocks(html: string, pageUrl: string): Block[] {
  const region = articleRegion(html);
  const re =
    /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>|<p[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>|<img[^>]+src=["']([^"']+)["']/gi;

  const blocks: Block[] = [];
  const seenImg = new Set<string>();
  let m: RegExpExecArray | null;

  while ((m = re.exec(region))) {
    if (m[1]) {
      const text = stripTags(m[2]);
      if (text.length > 1) blocks.push({ type: "h", text });
    } else if (m[3] !== undefined) {
      const text = stripTags(m[3]);
      if (text.length > 1) blocks.push({ type: "p", text });
    } else if (m[4] !== undefined) {
      const text = stripTags(m[4]);
      if (text.length > 1) blocks.push({ type: "li", text });
    } else if (m[5]) {
      const url = absoluteUrl(decodeEntities(m[5]), pageUrl);
      if (
        /\.(jpg|jpeg|png|webp|avif)(\?|$)/i.test(url) &&
        !/(logo|icon|favicon|avatar|sprite|placeholder|1x1|pixel)/i.test(url) &&
        !seenImg.has(url)
      ) {
        seenImg.add(url);
        blocks.push({ type: "img", url });
      }
    }
  }
  return blocks;
}

async function downloadImage(
  imageUrl: string,
  fileBase: string
): Promise<string | null> {
  try {
    const res = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TRIZENBot/1.0)" },
      cache: "no-store",
    });
    if (!res.ok) return null;

    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    let ext = IMAGE_EXT_BY_TYPE[type];
    if (!ext) {
      const urlExt = imageUrl.split("?")[0].split(".").pop()?.toLowerCase();
      ext =
        urlExt && /^(jpg|jpeg|png|webp|avif|gif)$/.test(urlExt) ? urlExt : "jpg";
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1024) return null; // skip tiny/broken images

    const dir = path.join(process.cwd(), "public", "blog");
    await mkdir(dir, { recursive: true });
    const fileName = `${fileBase}.${ext}`;
    await writeFile(path.join(dir, fileName), buffer);
    return `/blog/${fileName}`;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, category } = await request.json();

  if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
  }

  let html = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TRIZENBot/1.0)" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not fetch page (${res.status})` },
        { status: 400 }
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json({ error: "Failed to reach the URL" }, { status: 400 });
  }

  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
  const title =
    metaContent(html, "og:title") ||
    (titleTag ? decodeEntities(titleTag.trim()) : "") ||
    "Untitled";
  const description =
    metaContent(html, "og:description") ||
    metaContent(html, "description") ||
    "";

  let source = url;
  try {
    source = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    /* ignore */
  }

  const base = slugifyTitle(title) || `news-${Date.now()}`;
  let slug = base;
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const blocks = extractBlocks(html, url);

  // Download images (cap to keep it sane), map remote URL -> local path.
  const imageBlocks = blocks.filter((b): b is { type: "img"; url: string } => b.type === "img");
  const localByUrl = new Map<string, string>();
  let imgIndex = 0;
  for (const b of imageBlocks.slice(0, 12)) {
    const local = await downloadImage(b.url, `${slug}-${imgIndex + 1}`);
    if (local) {
      localByUrl.set(b.url, local);
      imgIndex++;
    }
  }

  // Cover = first successfully downloaded image, else first remote, else none.
  const coverImage =
    [...localByUrl.values()][0] || imageBlocks[0]?.url || "";

  // Build markdown-ish content from the ordered blocks (skip cover to avoid dupe).
  const lines: string[] = [];
  for (const b of blocks) {
    if (b.type === "h") lines.push(`## ${b.text}`);
    else if (b.type === "p") lines.push(b.text);
    else if (b.type === "li") lines.push(`- ${b.text}`);
    else if (b.type === "img") {
      const local = localByUrl.get(b.url);
      if (local && local !== coverImage) lines.push(`![](${local})`);
    }
  }

  const bodyText = lines.join("\n\n").trim();
  const content =
    (bodyText || description) +
    `\n\nSource: ${source}\nRead the full article: ${url}`;

  const firstParagraph =
    blocks.find((b): b is { type: "p"; text: string } => b.type === "p")?.text ||
    "";
  const excerpt = (description || firstParagraph).slice(0, 280);

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category: (category || "Esports").trim() || "Esports",
      author: "TRIZEN Store",
      published: false,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
