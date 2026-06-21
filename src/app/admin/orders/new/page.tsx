import { redirect } from "next/navigation";
import Link from "next/link";
import { isOwnerAdmin, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminOrderForm } from "@/components/admin/AdminOrderForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewOrderPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, price: true, stock: true },
  });

  if (products.length === 0) {
    return (
      <div className="ml-56 p-8">
        <p className="text-[var(--color-muted)]">Add products before creating orders.</p>
        {isOwnerAdmin(admin) ? (
          <Link href="/admin/products" className="text-sm underline mt-4 inline-block">
            Go to Products
          </Link>
        ) : (
          <p className="text-sm text-[var(--color-muted)] mt-4">
            Ask an owner admin to add products first.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="ml-56 p-8 max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Add Order</h1>
      <AdminOrderForm products={products} mode="create" />
    </div>
  );
}
