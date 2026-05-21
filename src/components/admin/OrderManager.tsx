"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Textarea } from "@/components/Textarea";
import { Input } from "@/components/Input";
import { ORDER_STATUSES } from "@/lib/utils";

type Order = {
  id: string;
  status: string;
  paymentRef: string | null;
  adminNotes: string | null;
};

export function OrderManager({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [paymentRef, setPaymentRef] = useState(order.paymentRef || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function save() {
    setLoading(true);
    setMessage("");
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paymentRef, adminNotes }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("Order updated successfully");
      router.refresh();
    } else {
      setMessage("Failed to update order");
    }
  }

  return (
    <section className="border border-[var(--color-border)] p-5 h-fit bg-[var(--color-surface-elevated)]">
      <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Manage Order</h2>

      <label className="block mb-4">
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-[var(--color-border)] bg-black px-4 py-3 text-sm outline-none focus:border-white"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
          <option value="cancelled">Cancelled</option>
        </select>
      </label>

      <div className="mb-4">
        <Input
          label="Payment Reference"
          value={paymentRef}
          onChange={(e) => setPaymentRef(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <Textarea
          label="Admin Notes (internal)"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
        />
      </div>

      {message && (
        <p className={`text-sm mb-3 ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      )}

      <Button onClick={save} disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </section>
  );
}
