import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/user-auth";
import { findReviewEligibility } from "@/lib/reviews";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const session = await getUserSession();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email") || session?.email || null;

  const eligibility = await findReviewEligibility({
    productId: product.id,
    userId: session?.id,
    email,
  });

  return NextResponse.json(eligibility);
}
