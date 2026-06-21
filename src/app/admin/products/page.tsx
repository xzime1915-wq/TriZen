import { redirect } from "next/navigation";
import { isOwnerAdmin, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductManager } from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  if (!isOwnerAdmin(admin)) redirect("/admin/orders");

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="ml-56 p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Products</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Add features, colors, gallery, description, specifications, and reviews content here.
      </p>
      <ProductManager products={products} />
    </div>
  );
}
