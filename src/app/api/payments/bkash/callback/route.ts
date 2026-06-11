import { NextResponse } from "next/server";
import { executeBkashPayment } from "@/lib/bkash";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/env";
import { notifyAdminNewOrder } from "@/lib/admin-notify";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentID = searchParams.get("paymentID")?.trim();
  const status = searchParams.get("status")?.trim().toLowerCase();

  const appUrl = getAppUrl(new URL(request.url).origin);

  if (!paymentID) {
    return NextResponse.redirect(
      `${appUrl}/checkout?payment=failed&message=${encodeURIComponent("Missing bKash payment ID")}`
    );
  }

  if (status === "cancel" || status === "failure") {
    return NextResponse.redirect(
      `${appUrl}/checkout?payment=failed&message=${encodeURIComponent("bKash payment was cancelled")}`
    );
  }

  const order = await prisma.order.findFirst({
    where: { paymentRef: `bkash_pending:${paymentID}` },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.redirect(
      `${appUrl}/checkout?payment=failed&message=${encodeURIComponent("Order not found for this payment")}`
    );
  }

  try {
    const result = await executeBkashPayment(paymentID);
    const trxID = result.trxID?.trim();
    const paid =
      result.transactionStatus === "Completed" ||
      result.statusCode === "0000" ||
      Boolean(trxID);

    if (!paid || !trxID) {
      return NextResponse.redirect(
        `${appUrl}/checkout?payment=failed&message=${encodeURIComponent(
          result.statusMessage || "bKash payment was not completed"
        )}`
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "processing",
          paymentRef: `bKash TRX: ${trxID}`,
          paidAt: new Date(),
        },
      });
    });

    notifyAdminNewOrder({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: order.total,
      paymentMethod: "bkash",
    });

    return NextResponse.redirect(
      `${appUrl}/order-confirmation/${order.orderNumber}?email=${encodeURIComponent(order.customerEmail)}&paid=1`
    );
  } catch (e) {
    console.error(e);
    const message = e instanceof Error ? e.message : "bKash payment failed";
    return NextResponse.redirect(
      `${appUrl}/checkout?payment=failed&message=${encodeURIComponent(message)}`
    );
  }
}
