import { NextResponse } from "next/server";
import {
  checkoutVerifyUserId,
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
  sendCheckoutEmailCode,
} from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getUserSession();
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(
    user?.email ?? String((body as { email?: string }).email ?? "")
  );

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const verifyUserId = checkoutVerifyUserId(user?.id, email);
  const ip = getClientIp(request);
  const limited = rateLimit(`checkout-email-send:${verifyUserId}:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many codes sent. Try again later." }, { status: 429 });
  }

  try {
    const result = await sendCheckoutEmailCode(verifyUserId, email);
    return NextResponse.json({ sent: true, devCode: result.devCode });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to send code";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
