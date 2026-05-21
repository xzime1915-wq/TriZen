import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { CustomerSearch } from "@/components/admin/CustomerSearch";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="ml-56 p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Customers</h1>
      <p className="text-sm text-[var(--color-muted)] mb-8">
        Search by phone number to view customer details and full order history.
      </p>
      <Suspense fallback={<p className="text-sm text-[var(--color-muted)]">Loading...</p>}>
        <CustomerSearch />
      </Suspense>
    </div>
  );
}
