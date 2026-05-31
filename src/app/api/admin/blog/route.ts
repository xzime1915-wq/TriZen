import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildBlogDbPayload, slugifyTitle } from "@/lib/blog";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const payload = buildBlogDbPayload(body);

  if (!payload.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const base = (body.slug && slugifyTitle(body.slug)) || slugifyTitle(payload.title);
  let slug = base || `post-${Date.now()}`;

  // Ensure unique slug.
  let n = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }

  const post = await prisma.blogPost.create({
    data: { ...payload, slug },
  });

  return NextResponse.json(post, { status: 201 });
}
