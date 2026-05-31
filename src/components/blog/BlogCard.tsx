import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatBlogDate, readingMinutes } from "@/lib/blog";

type Props = {
  post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    createdAt: string | Date;
  };
};

export function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="trizen-card-hover group flex flex-col overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain object-center p-4 transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-zinc-400">
            TriZen
          </div>
        )}
        <span className="absolute left-3 top-3 border border-[var(--color-border)] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--color-foreground)]">
          {post.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          <span>{formatBlogDate(post.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{readingMinutes(post.content)} min read</span>
        </div>
        <h3 className="mt-3 text-base font-bold uppercase leading-snug tracking-tight text-[var(--color-foreground)] group-hover:underline sm:text-lg">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
            {post.excerpt}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
          Read more <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
