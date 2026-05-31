import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BlogManager } from "@/components/admin/BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="ml-56 p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Blog</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Write articles and announcements. Published posts appear on the homepage
        and the /blog page.
      </p>
      <BlogManager
        posts={posts.map((p) => ({ ...p, createdAt: p.createdAt.toISOString() }))}
      />
    </div>
  );
}
