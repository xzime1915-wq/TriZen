import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    "all",
    "pending_payment",
    "payment_received",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="ml-56 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide">Orders</h1>
        <Link
          href="/admin/orders/new"
          className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-medium uppercase tracking-wider hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" /> Add Order
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <Link
            key={s}
            href={s === "all" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider border transition ${
              (s === "all" && !status) || status === s
                ? "bg-white text-black border-white"
                : "border-[var(--color-border)] hover:border-white"
            }`}
          >
            {s === "all" ? "All" : getStatusLabel(s)}
          </Link>
        ))}
      </div>

      <div className="border border-[var(--color-border)] overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--color-border)] hover:bg-zinc-900/50">
                <td className="p-3 font-mono">{o.orderNumber}</td>
                <td className="p-3">
                  <p>{o.customerName}</p>
                  <p className="text-xs text-[var(--color-muted)]">{o.customerEmail}</p>
                </td>
                <td className="p-3 font-mono text-[var(--color-muted)]">{o.customerPhone}</td>
                <td className="p-3 text-[var(--color-muted)]">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 font-medium">{formatCurrency(o.total)}</td>
                <td className={`p-3 ${getStatusColor(o.status)}`}>
                  {getStatusLabel(o.status)}
                </td>
                <td className="p-3 text-right space-x-3">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs uppercase hover:underline">
                    View
                  </Link>
                  <Link
                    href={`/admin/orders/${o.id}/edit`}
                    className="text-xs uppercase hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-[var(--color-muted)]">No orders found.</p>
        )}
      </div>
    </div>
  );
}
