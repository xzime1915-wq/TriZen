import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  contentToParagraphs,
  formatBlogDate,
  readingMinutes,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogShareBar } from "@/components/blog/BlogShareBar";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const URL_RE = /(https?:\/\/[^\s]+)/g;
const IMG_RE = /^!\[[^\]]*\]\(([^)]+)\)$/;

/** Turn raw URLs inside text into clickable links. */
function linkify(text: string) {
  const parts = text.split(URL_RE);
  return parts.map((part, i) => {
    if (URL_RE.test(part)) {
      URL_RE.lastIndex = 0;
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium text-blue-600 underline underline-offset-2 break-all hover:text-blue-700"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

/** Render content blocks: images, headings, list items, and paragraphs. */
function renderBlocks(blocks: string[]) {
  const out: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    out.push(
      <ul key={key} className="ml-5 list-disc space-y-1.5">
        {listBuffer.map((item, i) => (
          <li key={i}>{linkify(item)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  blocks.forEach((block, idx) => {
    const imgMatch = block.match(IMG_RE);

    if (block.startsWith("- ")) {
      listBuffer.push(block.slice(2).trim());
      return;
    }
    flushList(`list-${idx}`);

    if (imgMatch) {
      out.push(
        <span
          key={idx}
          className="relative my-2 block overflow-hidden border border-[var(--color-border)] bg-zinc-100"
        >
          <Image
            src={imgMatch[1]}
            alt=""
            width={1280}
            height={720}
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full object-contain"
          />
        </span>
      );
    } else if (block.startsWith("## ")) {
      out.push(
        <h2
          key={idx}
          className="trizen-headline pt-2 text-lg leading-snug sm:text-xl"
        >
          {block.slice(3).trim()}
        </h2>
      );
    } else {
      out.push(
        <p key={idx} className="whitespace-pre-line break-words">
          {linkify(block)}
        </p>
      );
    }
  });

  flushList("list-end");
  return out;
}

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    return { title: "Post not found" };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const description =
    post.excerpt || contentToParagraphs(post.content)[0]?.slice(0, 160) || "";

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) notFound();

  const shareUrl = `${SITE_URL}/blog/${post.slug}`;
  const paragraphs = contentToParagraphs(post.content);
  const related = await prisma.blogPost.findMany({
    where: { published: true, slug: { not: post.slug } },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${SITE_URL}${post.coverImage}` : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container-trizen max-w-3xl py-12 md:py-16 lg:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All posts
        </Link>

        <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <span className="border border-[var(--color-border)] px-2 py-0.5 font-bold text-[var(--color-foreground)]">
            {post.category}
          </span>
          <span>{formatBlogDate(post.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{readingMinutes(post.content)} min read</span>
        </div>

        <h1 className="trizen-headline mt-4 text-2xl leading-tight sm:text-3xl md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">By {post.author}</p>

        <BlogShareBar url={shareUrl} title={post.title} />

        {post.coverImage && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden border border-[var(--color-border)] bg-zinc-100">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain object-center p-4"
            />
          </div>
        )}

        <div className="mt-8 space-y-5 text-[0.95rem] leading-relaxed text-zinc-700 md:text-base">
          {renderBlocks(paragraphs)}
        </div>

        <BlogShareBar
          url={shareUrl}
          title={post.title}
          className="blog-share-bar--end"
        />
      </article>

      {related.length > 0 && (
        <section>
          <div className="container-trizen py-12 md:py-16">
            <h2 className="trizen-eyebrow mb-8">More from the blog</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard
                  key={p.id}
                  post={{
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.excerpt,
                    content: p.content,
                    coverImage: p.coverImage,
                    category: p.category,
                    createdAt: p.createdAt.toISOString(),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
