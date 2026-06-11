import { NextResponse } from "next/server";
import { isCheckoutEmailVerified } from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";

export async function GET() {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ verified: false }, { status: 401 });
  }

  const verified = await isCheckoutEmailVerified(user.id, user.email);
  return NextResponse.json({ verified, email: user.email });
}
