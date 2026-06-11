import { NextResponse } from "next/server";
import { getCheckoutUpsells } from "@/lib/checkout-upsell";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exclude = searchParams.get("exclude")?.split(",").filter(Boolean) ?? [];

  try {
    const items = await getCheckoutUpsells(exclude);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
