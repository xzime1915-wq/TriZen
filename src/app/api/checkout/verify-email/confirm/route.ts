import { NextResponse } from "next/server";
import {
  checkoutVerifyUserId,
  confirmCheckoutEmailCode,
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getUserSession();
  const body = await request.json();
  const email = normalizeCheckoutEmail(
    user?.email ?? String(body.email ?? "")
  );

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const verifyUserId = checkoutVerifyUserId(user?.id, email);
  const ip = getClientIp(request);
  const limited = rateLimit(`checkout-email-confirm:${verifyUserId}:${ip}`, 12, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const code = String(body.code ?? "").trim();
  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const result = await confirmCheckoutEmailCode(verifyUserId, email, code);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ verified: true });
}
