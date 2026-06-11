import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/orders";
import { requireCheckoutEmailVerified } from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";
import { parseCreateOrderPayload } from "@/lib/order-validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`order-post:${ip}`, 15, 60 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many orders. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = parseCreateOrderPayload(body);
    if (typeof parsed === "string") {
      return NextResponse.json({ error: parsed }, { status: 400 });
    }

    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: "Sign in required to place an order." },
        { status: 401 }
      );
    }

    try {
      await requireCheckoutEmailVerified(session.id, session.email);
    } catch {
      return NextResponse.json(
        { error: "Please verify your email before placing an order." },
        { status: 403 }
      );
    }

    const order = await createOrder({
      userId: session.id,
      ...parsed,
      customerEmail: session.email,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`order-track:${ip}`, 30, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Order number and email required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerEmail: email,
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
