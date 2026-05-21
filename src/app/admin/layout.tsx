import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {admin && <AdminNav admin={admin} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
