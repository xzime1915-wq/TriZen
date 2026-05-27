import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { Button } from "@/components/Button";
import { CheckCircle, Truck } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email: rawEmail } = await searchParams;
  const email = rawEmail?.trim().toLowerCase();

  if (!email) notFound();

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      customerEmail: email,
    },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="container-trizen py-16 max-w-2xl mx-auto text-center">
      <CheckCircle className="h-16 w-16 mx-auto text-emerald-400 mb-6" />
      <h1 className="text-3xl font-bold uppercase mb-2">Order Placed!</h1>
      <p className="text-[var(--color-muted)] mb-8">
        Thank you, {order.customerName}. Your order has been received.
      </p>

      <div className="border border-[var(--color-border)] p-6 text-left bg-[var(--color-surface-elevated)] mb-8">
        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Order Number</p>
            <p className="font-mono font-semibold">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Invoice</p>
            <p className="font-mono font-semibold">{order.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Status</p>
            <p>{getStatusLabel(order.status)}</p>
          </div>
          <div>
            <p className="text-[var(--color-muted)] text-xs uppercase mb-1">Total</p>
            <p className="font-semibold">{formatCurrency(order.total)}</p>
          </div>
        </div>

        <h3 className="text-xs uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4" /> Cash on Delivery
        </h3>
        <p className="text-sm text-[var(--color-muted)]">
          Pay <strong className="text-[var(--color-foreground)]">{formatCurrency(order.total)}</strong> in cash when
          your order is delivered. We will contact you at {order.customerPhone} to confirm
          delivery.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href={`/track-order?orderNumber=${order.orderNumber}&email=${encodeURIComponent(order.customerEmail)}`}>
          <Button variant="secondary">Track Order</Button>
        </Link>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
