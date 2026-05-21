import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { OrderManager } from "@/components/admin/OrderManager";
import { FileText, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="ml-56 p-8">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-mono">{order.orderNumber}</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            {getStatusLabel(order.status)} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/orders/${order.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white text-sm uppercase tracking-wider hover:bg-white hover:text-black"
          >
            Edit Order
          </Link>
          <Link
            href={`/admin/orders/${order.id}/invoice`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm uppercase tracking-wider hover:border-white"
          >
            <FileText className="h-4 w-4" /> Invoice
          </Link>
          {order.customerPhone && (
            <Link
              href={`/admin/customers?q=${encodeURIComponent(order.customerPhone)}`}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] text-sm uppercase tracking-wider hover:border-white"
            >
              Customer History
            </Link>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="border border-[var(--color-border)] p-5">
            <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Items</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-muted)] text-xs uppercase">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-[var(--color-border)]">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.quantity}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Delivery Charge</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="border border-[var(--color-border)] p-5">
            <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Customer</h2>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--color-muted)] text-xs">Name</dt>
                <dd>{order.customerName}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)] text-xs">Email</dt>
                <dd>{order.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-muted)] text-xs">Phone</dt>
                <dd>{order.customerPhone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[var(--color-muted)] text-xs">Address</dt>
                <dd>
                  {order.shippingAddress}, {order.city}
                  {order.country ? `, ${order.country}` : ""}
                </dd>
              </div>
              {order.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-[var(--color-muted)] text-xs">Customer Notes</dt>
                  <dd>{order.notes}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <OrderManager order={order} />
      </div>
    </div>
  );
}
