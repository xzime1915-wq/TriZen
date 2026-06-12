"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { formatCurrency, getStatusLabel } from "@/lib/utils";

type OrderItem = { name: string; quantity: number; price: number };
type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  paymentMethod: string;
  items: OrderItem[];
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingAddress: string | null;
  city: string | null;
  country: string;
  orders: Order[];
  _count: { orders: number };
};

export function CustomerSearch() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searched, setSearched] = useState(false);

  async function search(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    setCustomers(data);
    setLoading(false);
  }

  useEffect(() => {
    if (initialQ) search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function syncAll() {
    setSyncing(true);
    await fetch("/api/admin/customers", { method: "POST" });
    await search();
    setSyncing(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={search} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[240px]">
          <Input
            label="Search by phone, name, or email"
            placeholder="e.g. 01860841739"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
        <Button type="button" variant="secondary" onClick={syncAll} disabled={syncing}>
          {syncing ? "Syncing..." : "Sync from orders"}
        </Button>
      </form>

      {!searched && customers.length === 0 && (
        <p className="text-sm text-[var(--color-muted)]">
          Search a customer phone number to see all their orders and details.
        </p>
      )}

      {searched && customers.length === 0 && (
        <p className="text-sm text-[var(--color-muted)]">No customers found. Try sync from orders.</p>
      )}

      {customers.map((c) => {
        const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
        return (
          <div
            key={c.id}
            className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)]"
          >
            <div className="p-5 border-b border-[var(--color-border)] flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {c.name}
                  {c.id === "unlinked" && (
                    <span className="ml-2 text-xs font-normal text-amber-400/90">
                      (not synced, click Sync from orders)
                    </span>
                  )}
                </h2>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  <span className="text-[var(--color-foreground)] font-mono">{c.phone}</span> · {c.email}
                </p>
                {(c.shippingAddress || c.city) && (
                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    {c.shippingAddress}
                    {c.city ? `, ${c.city}` : ""}
                    {c.country ? `, ${c.country}` : ""}
                  </p>
                )}
              </div>
              <div className="text-right text-sm">
                <p>
                  <span className="text-[var(--color-muted)]">Orders:</span> {c._count.orders}
                </p>
                <p className="font-semibold mt-1">Total spent: {formatCurrency(totalSpent)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="bg-zinc-100 text-left text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {c.orders.map((o) => (
                    <tr key={o.id} className="border-t border-[var(--color-border)]">
                      <td className="p-3 font-mono">{o.orderNumber}</td>
                      <td className="p-3 text-[var(--color-muted)]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-[var(--color-muted)] max-w-xs">
                        {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                      </td>
                      <td className="p-3 capitalize">{o.paymentMethod}</td>
                      <td className="p-3">{formatCurrency(o.total)}</td>
                      <td className="p-3">{getStatusLabel(o.status)}</td>
                      <td className="p-3">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="text-xs uppercase hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {c.orders.length === 0 && (
                <p className="p-6 text-center text-[var(--color-muted)] text-sm">No orders yet.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
