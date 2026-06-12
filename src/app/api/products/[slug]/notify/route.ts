import { NextResponse } from "next/server";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { prisma } from "@/lib/prisma";
import {
  getProductNotifyStatus,
  subscribeProductNotify,
} from "@/lib/product-notify";
import { isUpcoming } from "@/lib/product-status";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getUserSession } from "@/lib/user-auth";

async function getUpcomingProduct(slug: string) {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !isUpcoming(product.tag)) return null;
  return product;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getUpcomingProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const user = await getUserSession();
  if (!user?.email) {
    return NextResponse.json({ subscribed: false, loggedIn: false });
  }

  const subscribed = await getProductNotifyStatus(product.id, user.email);
  return NextResponse.json({
    subscribed,
    loggedIn: true,
    email: user.email,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await getUpcomingProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const user = await getUserSession();
  const body = await request.json().catch(() => ({}));
  const email = normalizeCheckoutEmail(
    user?.email ?? String((body as { email?: string }).email ?? "")
  );

  if (!isCheckoutEmailAddress(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const limited = rateLimit(
    `product-notify:${product.id}:${email}:${ip}`,
    8,
    15 * 60 * 1000
  );
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  try {
    const result = await subscribeProductNotify({
      productId: product.id,
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
