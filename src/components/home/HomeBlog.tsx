import Link from "next/link";
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
    <section className="bg-white py-12 md:py-20 lg:py-24">
      <div className="container-trizen-full">
        <h2 className="trizen-wh-section-label mb-8 md:mb-12">Related blog posts</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} variant="wallhack" />
          ))}
        </div>
      </div>
    </section>
  );
}
