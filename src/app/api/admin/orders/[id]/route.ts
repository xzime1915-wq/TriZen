import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhone, upsertCustomerFromOrder } from "@/lib/customers";
import { buildOrderItems, restoreOrderStock } from "@/lib/orders";
import { sendReviewInvitesForOrder } from "@/lib/review-invite";

function orderHoldsStock(order: { status: string; paymentRef: string | null }) {
  return (
    order.status !== "cancelled" &&
    !order.paymentRef?.startsWith("bkash_pending:")
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const {
      status,
      adminNotes,
      paymentRef,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      country,
      notes,
      shippingCost,
      items,
    } = body;

    let subtotal = existing.subtotal;
    const nextStatus = status ?? existing.status;
    const existingHeldStock = orderHoldsStock(existing);
    const deferredPaymentStock =
      existing.paymentRef?.startsWith("bkash_pending:") &&
      existing.status === "pending_payment";
    const nextShouldHoldStock = nextStatus !== "cancelled" && !deferredPaymentStock;

    if (items?.length) {
      if (existingHeldStock) {
        await restoreOrderStock(id);
      }
      const built = await buildOrderItems(items);
      subtotal = built.subtotal;

      await prisma.orderItem.deleteMany({ where: { orderId: id } });
      await prisma.orderItem.createMany({
        data: built.orderItems.map((i) => ({ ...i, orderId: id })),
      });

      if (nextShouldHoldStock) {
        for (const item of built.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    const ship = shippingCost ?? existing.shippingCost;
    const total = subtotal + ship;

    const customer = await upsertCustomerFromOrder({
      name: customerName ?? existing.customerName,
      email: customerEmail ?? existing.customerEmail,
      phone: customerPhone ?? existing.customerPhone,
      shippingAddress: shippingAddress ?? existing.shippingAddress,
      city: city ?? existing.city,
      country: country ?? existing.country,
    });

    const updateData: Record<string, unknown> = {
      subtotal,
      shippingCost: ship,
      total,
      customerId: customer?.id,
    };

    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerPhone !== undefined)
      updateData.customerPhone = normalizePhone(customerPhone);
    if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (notes !== undefined) updateData.notes = notes;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (paymentRef !== undefined) updateData.paymentRef = paymentRef;

    if (status) {
      updateData.status = status;
      if (status === "payment_received") updateData.paidAt = new Date();
      if (status === "shipped") updateData.shippedAt = new Date();
      if (status === "delivered") updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, customer: true },
    });

    if (status === "delivered" && existing.status !== "delivered") {
      sendReviewInvitesForOrder(order.id).catch((error) => {
        console.error("[review-invite]", error);
      });
    }

    if (!items?.length && status === "cancelled" && existingHeldStock) {
      await restoreOrderStock(id);
    }

    if (
      !items?.length &&
      existing.status === "cancelled" &&
      nextShouldHoldStock
    ) {
      for (const item of existing.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    return NextResponse.json(order);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to update order";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (orderHoldsStock(order)) {
    await restoreOrderStock(id);
  }

  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
