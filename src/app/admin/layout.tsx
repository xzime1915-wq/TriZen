import { getAdminSession, isOwnerAdmin } from "@/lib/auth";
import { AdminAlerts } from "@/components/admin/AdminAlerts";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {admin && (
        <>
          <AdminNav admin={admin} />
          {isOwnerAdmin(admin) && <AdminAlerts />}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
