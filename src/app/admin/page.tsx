import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getStatusLabel } from "@/lib/utils";
import { DollarSign, Package, ShoppingBag, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [orders, products, pending] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: "pending_payment" } }),
  ]);

  const revenue = await prisma.order.aggregate({
    where: { status: { not: "cancelled" } },
    _sum: { total: true },
  });

  const stats = [
    { label: "Total Revenue", value: formatCurrency(revenue._sum.total ?? 0), icon: DollarSign },
    { label: "Products", value: String(products), icon: Package },
    { label: "Pending Payment", value: String(pending), icon: Clock },
    { label: "Recent Orders", value: String(orders.length), icon: ShoppingBag },
  ];

  return (
    <div className="ml-56 p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-[var(--color-border)] p-5 bg-[var(--color-surface-elevated)]"
          >
            <Icon className="h-5 w-5 text-[var(--color-muted)] mb-3" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-1">
              {label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">Recent Orders</h2>
      <div className="border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-900 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--color-border)]">
                <td className="p-3 font-mono">{o.orderNumber}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{formatCurrency(o.total)}</td>
                <td className="p-3">{getStatusLabel(o.status)}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-xs uppercase hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
