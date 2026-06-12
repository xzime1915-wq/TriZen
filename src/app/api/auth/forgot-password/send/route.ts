import { NextResponse } from "next/server";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { sendPasswordResetCode } from "@/lib/password-reset";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(String((body as { email?: string }).email ?? ""));

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`password-reset-send:${email}:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many codes sent. Try again later." }, { status: 429 });
  }

  try {
    const result = await sendPasswordResetCode(email);
    return NextResponse.json({
      sent: true,
      devCode: result.devCode,
    });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Failed to send code";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
