import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminChat } from "@/components/admin/AdminChat";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="ml-56 p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-6">Live Chat</h1>
      <AdminChat />
    </div>
  );
}
