import { NextResponse } from "next/server";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { confirmPasswordResetCode } from "@/lib/password-reset";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(String((body as { email?: string }).email ?? ""));
  const code = String((body as { code?: string }).code ?? "").trim();

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`password-reset-confirm:${email}:${ip}`, 12, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const result = await confirmPasswordResetCode(email, code);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ verified: true });
}
