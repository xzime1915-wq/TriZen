import { NextResponse } from "next/server";
import {
  checkoutVerifyUserId,
  isCheckoutEmailAddress,
  isCheckoutEmailVerified,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";

export async function GET(request: Request) {
  const user = await getUserSession();
  const { searchParams } = new URL(request.url);
  const email = normalizeCheckoutEmail(
    user?.email ?? String(searchParams.get("email") ?? "")
  );

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ verified: false });
  }

  const verifyUserId = checkoutVerifyUserId(user?.id, email);
  const verified = await isCheckoutEmailVerified(verifyUserId, email);
  return NextResponse.json({ verified, email });
}
