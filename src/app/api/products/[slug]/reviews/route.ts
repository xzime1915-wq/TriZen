import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/user-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviews = await prisma.productReview.findMany({
    where: { productId: product.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      authorName: true,
      rating: true,
      title: true,
      body: true,
      createdAt: true,
    },
  });

  return NextResponse.json(reviews);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = getClientIp(request);
  const limited = rateLimit(`review-post:${ip}`, 8, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many reviews. Try later." }, { status: 429 });
  }

  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const rating = Number(body.rating);
  const reviewBody = String(body.body || "").trim();
  const title = String(body.title || "").trim();

  if (!reviewBody) {
    return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  const session = await getUserSession();
  let authorName = String(body.authorName || "").trim();
  let authorEmail = String(body.authorEmail || "").trim().toLowerCase();

  if (session) {
    authorName = authorName || session.name || session.email.split("@")[0];
    authorEmail = session.email;
  } else {
    if (!authorName || !authorEmail) {
      return NextResponse.json(
        { error: "Name and email are required to leave a review" },
        { status: 400 }
      );
    }
  }

  const review = await prisma.productReview.create({
    data: {
      productId: product.id,
      userId: session?.id,
      authorName,
      authorEmail,
      rating,
      title,
      body: reviewBody,
    },
    select: {
      id: true,
      authorName: true,
      rating: true,
      title: true,
      body: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    { ...review, createdAt: review.createdAt.toISOString() },
    { status: 201 }
  );
}
