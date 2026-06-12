import { NextResponse } from "next/server";
import { clearCheckoutEmailVerifiedCookie } from "@/lib/checkout-email-verify";

export async function POST() {
  await clearCheckoutEmailVerifiedCookie();
  return NextResponse.json({ reset: true });
}
