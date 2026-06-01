import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string | Date;
};

export function HomeBlog({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="trizen-section-dark relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-trizen py-14 md:py-20 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div>
            <p className="trizen-eyebrow mb-2 md:mb-4">From the blog</p>
            <h2 className="trizen-headline text-2xl md:text-4xl">
              Guides & news
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-[var(--color-foreground)]"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}
