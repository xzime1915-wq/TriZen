import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminOrderForm } from "@/components/admin/AdminOrderForm";
import { DeleteOrderButton } from "@/components/admin/DeleteOrderButton";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const [order, products] = await Promise.all([
    prisma.order.findUnique({ where: { id }, include: { items: true } }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, stock: true },
    }),
  ]);

  if (!order) notFound();

  return (
    <div className="ml-56 p-8 max-w-4xl">
      <Link
        href={`/admin/orders/${order.id}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-white mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Order
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Edit Order · <span className="font-mono">{order.orderNumber}</span>
        </h1>
        <DeleteOrderButton orderId={order.id} />
      </div>
      <AdminOrderForm
        products={products}
        mode="edit"
        order={{
          id: order.id,
          status: order.status,
          paymentMethod: order.paymentMethod,
          paymentRef: order.paymentRef,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          city: order.city,
          country: order.country,
          notes: order.notes,
          adminNotes: order.adminNotes,
          shippingCost: order.shippingCost,
          items: order.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }}
      />
    </div>
  );
}
