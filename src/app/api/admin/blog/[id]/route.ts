import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { buildBlogDbPayload, slugifyTitle } from "@/lib/blog";
import { broadcastBlogPostToSandbox } from "@/lib/newsletter-broadcast";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const payload = buildBlogDbPayload(body);

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = { ...payload };

  // Allow editing the slug; keep it unique against other posts.
  if (body.slug) {
    const base = slugifyTitle(body.slug);
    let slug = base || `post-${Date.now()}`;
    let n = 1;
    while (true) {
      const existing = await prisma.blogPost.findUnique({ where: { slug } });
      if (!existing || existing.id === id) break;
      slug = `${base}-${n++}`;
    }
    data.slug = slug;
  }

  const post = await prisma.blogPost.update({ where: { id }, data });

  if (post.published && !existing.published) {
    void broadcastBlogPostToSandbox(post).catch((error) => {
      console.error("[sandbox blog broadcast publish]", error);
    });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
