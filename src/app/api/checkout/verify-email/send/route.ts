import { NextResponse } from "next/server";
import { sendCheckoutEmailCode } from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limited = rateLimit(`checkout-email-send:${user.id}:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many codes sent. Try again later." }, { status: 429 });
  }

  try {
    const result = await sendCheckoutEmailCode(user.id, user.email);
    return NextResponse.json({ sent: true, devCode: result.devCode });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to send code";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
