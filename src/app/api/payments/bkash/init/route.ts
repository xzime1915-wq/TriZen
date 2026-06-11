import { NextResponse } from "next/server";
import { createBkashPayment, isBkashConfigured } from "@/lib/bkash";
import { createOrder } from "@/lib/orders";
import { parseCreateOrderPayload } from "@/lib/order-validation";
import { requireCheckoutEmailVerified } from "@/lib/checkout-email-verify";
import { getUserSession } from "@/lib/user-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    if (!isBkashConfigured()) {
      return NextResponse.json(
        { error: "bKash payment is not configured yet." },
        { status: 503 }
      );
    }

    const ip = getClientIp(request);
    const limited = rateLimit(`bkash-init:${ip}`, 20, 60 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = parseCreateOrderPayload(body);
    if (typeof parsed === "string") {
      return NextResponse.json({ error: parsed }, { status: 400 });
    }

    if (parsed.paymentMethod !== "bkash") {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }

    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
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
      paymentMethod: "bkash",
      paymentRef: null,
      status: "pending_payment",
      decrementStock: false,
      notifyAdmin: false,
    });

    const payment = await createBkashPayment({
      amount: order.total,
      orderNumber: order.orderNumber,
      payerReference: parsed.customerPhone,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentRef: `bkash_pending:${payment.paymentID}`,
      },
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      bkashURL: payment.bkashURL,
      paymentID: payment.paymentID,
    });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : "bKash payment failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
