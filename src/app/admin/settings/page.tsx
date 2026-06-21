import { redirect } from "next/navigation";
import { isOwnerAdmin, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { WhatsAppAlertsCard } from "@/components/admin/WhatsAppAlertsCard";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  if (!isOwnerAdmin(admin)) redirect("/admin/orders");

  const settings = await prisma.storeSettings.findFirst();

  return (
    <div className="ml-56 p-8 max-w-3xl">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Store Settings</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Configure bank payment details, shipping, and store information.
      </p>
      {settings && <SettingsForm settings={settings} />}
      <WhatsAppAlertsCard />
    </div>
  );
}
