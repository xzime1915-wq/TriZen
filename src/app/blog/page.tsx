import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/PageHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog — Esports Gear Guides & News",
  description:
    "TriZen Store blog — guides on glass mouse pads, esports gear, setup tips, and product news for gamers in Bangladesh.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      "Guides on glass mouse pads, esports gear, and gaming setup tips from TriZen Store.",
    url: `${SITE_URL}/blog`,
  },
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <PageHero
        eyebrow="Blog"
        title="Guides & News"
        description="Glass mouse pad guides, esports gear tips, and TriZen product news — for players across Bangladesh."
      />

      <section className="border-b border-[var(--color-border)]">
        <div className="container-trizen py-14 md:py-20">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-[var(--color-muted)]">
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
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
          )}
        </div>
      </section>
    </div>
  );
}
