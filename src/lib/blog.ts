export type BlogPostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function slugifyTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Split stored content into clean paragraphs for rendering. */
export function contentToParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Rough read-time estimate from content length. */
export function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatBlogDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type BlogInput = {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  author?: string;
  published?: boolean;
};

/** Normalise admin form input into a DB-ready payload. */
export function buildBlogDbPayload(input: BlogInput) {
  const title = (input.title ?? "").trim();
  return {
    title,
    excerpt: (input.excerpt ?? "").trim(),
    content: (input.content ?? "").trim(),
    coverImage: (input.coverImage ?? "").trim(),
    category: (input.category ?? "News").trim() || "News",
    author: (input.author ?? "TriZen Store").trim() || "TriZen Store",
    published: input.published ?? true,
  };
}
