import { NextResponse } from "next/server";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { resetPasswordWithVerifiedSession } from "@/lib/password-reset";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(String((body as { email?: string }).email ?? ""));
  const password = String((body as { password?: string }).password ?? "");

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`password-reset-submit:${email}:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const result = await resetPasswordWithVerifiedSession(email, password);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
