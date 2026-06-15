import { NextResponse } from "next/server";
import { getCheckoutUpsells } from "@/lib/checkout-upsell";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exclude = searchParams.get("exclude")?.split(",").filter(Boolean) ?? [];
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "2", 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 8)
    : 2;

  try {
    const items = await getCheckoutUpsells(exclude, limit);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
