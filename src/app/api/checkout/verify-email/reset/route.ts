import { NextResponse } from "next/server";
import { clearCheckoutEmailVerifiedCookie } from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";

export async function POST() {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  await clearCheckoutEmailVerifiedCookie();
  return NextResponse.json({ reset: true });
}
