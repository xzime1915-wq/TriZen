"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { ORDER_STATUSES, DELIVERY_CHARGE } from "@/lib/utils";

type Product = { id: string; name: string; price: number; stock: number };

type LineItem = { productId: string; quantity: number };

type OrderData = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentRef: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country: string;
  notes: string | null;
  adminNotes: string | null;
  shippingCost: number;
  items: { productId: string; quantity: number }[];
};

export function AdminOrderForm({
  products,
  order,
  mode,
}: {
  products: Product[];
  order?: OrderData;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lines, setLines] = useState<LineItem[]>(
    order?.items?.length
      ? order.items
      : [{ productId: products[0]?.id || "", quantity: 1 }]
  );
  const [form, setForm] = useState({
    customerName: order?.customerName || "",
    customerEmail: order?.customerEmail || "",
    customerPhone: order?.customerPhone || "",
    shippingAddress: order?.shippingAddress || "",
    city: order?.city || "Dhaka",
    country: order?.country || "Bangladesh",
    notes: order?.notes || "",
    adminNotes: order?.adminNotes || "",
    paymentMethod: order?.paymentMethod || "cod",
    paymentRef: order?.paymentRef || "",
    status: order?.status || "pending_payment",
    shippingCost: order?.shippingCost ?? DELIVERY_CHARGE,
  });

  function addLine() {
    setLines([...lines, { productId: products[0]?.id || "", quantity: 1 }]);
  }

  function updateLine(i: number, patch: Partial<LineItem>) {
    setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  }

  function removeLine(i: number) {
    if (lines.length <= 1) return;
    setLines(lines.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { ...form, items: lines.filter((l) => l.productId && l.quantity > 0) };

    const url = mode === "create" ? "/api/admin/orders" : `/api/admin/orders/${order!.id}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to save order");
      return;
    }

    router.push(`/admin/orders/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="border border-[var(--color-border)] p-5">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Customer</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
          <Input
            label="Phone *"
            required
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          />
          <Input
            label="Email *"
            type="email"
            required
            className="sm:col-span-2"
            value={form.customerEmail}
            onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          />
          <Input
            label="Address *"
            required
            className="sm:col-span-2"
            value={form.shippingAddress}
            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
          />
          <Input
            label="District / City *"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            label="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
      </section>

      <section className="border border-[var(--color-border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs uppercase tracking-widest font-semibold">Products</h2>
          <button
            type="button"
            onClick={addLine}
            className="text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-white"
          >
            + Add product
          </button>
        </div>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <div key={i} className="flex flex-wrap gap-3 items-end">
              <label className="flex-1 min-w-[200px]">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  Product
                </span>
                <select
                  value={line.productId}
                  onChange={(e) => updateLine(i, { productId: e.target.value })}
                  className="w-full border border-[var(--color-border)] bg-black px-4 py-3 text-sm outline-none focus:border-white"
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ৳{p.price} (stock: {p.stock})
                    </option>
                  ))}
                </select>
              </label>
              <label className="w-24">
                <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  Qty
                </span>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => updateLine(i, { quantity: Number(e.target.value) })}
                  className="w-full border border-[var(--color-border)] bg-black px-3 py-3 text-sm outline-none focus:border-white"
                  required
                />
              </label>
              {lines.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLine(i)}
                  className="pb-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[var(--color-border)] p-5">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Payment & Status</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Status
            </span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-[var(--color-border)] bg-black px-4 py-3 text-sm outline-none focus:border-white"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
              Payment Method
            </span>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full border border-[var(--color-border)] bg-black px-4 py-3 text-sm outline-none focus:border-white"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="bank">Bank Payment</option>
              <option value="bkash">bKash</option>
              <option value="nagad">Nagad</option>
            </select>
          </label>
          <Input
            label="Payment Reference"
            className="sm:col-span-2"
            value={form.paymentRef}
            onChange={(e) => setForm({ ...form, paymentRef: e.target.value })}
          />
          <Input
            label="Delivery Charge"
            type="number"
            min={0}
            value={form.shippingCost}
            onChange={(e) => setForm({ ...form, shippingCost: Number(e.target.value) })}
          />
        </div>
        <div className="mt-4 grid gap-4">
          <Textarea
            label="Customer Notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <Textarea
            label="Admin Notes (internal)"
            value={form.adminNotes}
            onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
          />
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Create Order" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
