import { NextResponse } from "next/server";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import {
  getGearNotifyStatus,
  subscribeGearNotify,
} from "@/lib/gear-notify";
import { isShopGearLine } from "@/lib/shop-gears";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getUserSession } from "@/lib/user-auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ gear: string }> },
) {
  const { gear } = await params;
  if (!isShopGearLine(gear)) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const user = await getUserSession();
  if (!user?.email) {
    return NextResponse.json({ subscribed: false, loggedIn: false });
  }

  const subscribed = await getGearNotifyStatus(gear, user.email);
  return NextResponse.json({
    subscribed,
    loggedIn: true,
    email: user.email,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gear: string }> },
) {
  const { gear } = await params;
  if (!isShopGearLine(gear)) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  const user = await getUserSession();
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(
    user?.email ?? String((body as { email?: string }).email ?? ""),
  );

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const ip = getClientIp(request);
  const limited = rateLimit(
    `gear-notify:${gear}:${email}:${ip}`,
    8,
    15 * 60 * 1000,
  );
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 },
    );
  }

  try {
    const result = await subscribeGearNotify({
      gear,
      email,
      userId: user?.id,
    });

    return NextResponse.json({
      subscribed: true,
      alreadySubscribed: result.alreadySubscribed,
      email: result.email,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to save notification.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
