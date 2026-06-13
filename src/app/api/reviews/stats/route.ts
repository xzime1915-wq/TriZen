import { NextResponse } from "next/server";
import { getVerifiedReviewStats } from "@/lib/reviews";

export async function GET() {
  const stats = await getVerifiedReviewStats();

  return NextResponse.json({
    averageRating: stats._avg.rating ?? 0,
    totalReviews: stats._count,
  });
}
