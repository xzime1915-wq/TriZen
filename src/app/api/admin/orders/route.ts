import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOrder } from "@/lib/orders";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q } },
              { customerName: { contains: q } },
              { customerPhone: { contains: q } },
              { customerEmail: { contains: q } },
            ],
          }
        : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      country,
      notes,
      adminNotes,
      paymentMethod,
      paymentRef,
      status,
      shippingCost,
      items,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Add at least one product" }, { status: 400 });
    }

    const order = await createOrder({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: shippingAddress || "—",
      city: city || "—",
      country,
      notes,
      adminNotes,
      paymentMethod,
      paymentRef,
      status,
      shippingCost,
      items,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
