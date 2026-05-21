"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Button";

export function DeleteOrderButton({
  orderId,
  redirectTo = "/admin/orders",
}: {
  orderId: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this order? Stock will be restored if applicable.")) return;
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    setLoading(false);
    if (res.ok) {
      router.push(redirectTo);
      router.refresh();
    } else {
      alert("Failed to delete order");
    }
  }

  return (
    <Button type="button" variant="danger" onClick={handleDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete Order"}
    </Button>
  );
}
