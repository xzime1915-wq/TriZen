"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatCurrency, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Package, Clock } from "lucide-react";

type Order = {
  orderNumber: string;
  invoiceNumber: string | null;
  status: string;
  total: number;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: { name: string; quantity: number; price: number }[];
  customerName: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

const STEPS = [
  "pending_payment",
  "payment_received",
  "processing",
  "shipped",
  "delivered",
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const on = searchParams.get("orderNumber");
    const em = searchParams.get("email");
    if (on && em) {
      setOrderNumber(on);
      setEmail(em);
      fetchOrder(on, em);
    }
  }, [searchParams]);

  async function fetchOrder(on?: string, em?: string) {
    setLoading(true);
    setError("");
    setOrder(null);
    const res = await fetch(
      `/api/orders?orderNumber=${encodeURIComponent(on || orderNumber)}&email=${encodeURIComponent(em || email)}`
    );
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Order not found");
      return;
    }
    setOrder(data);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchOrder();
  }

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="container-trizen py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">Track Order</h1>
      <p className="text-[var(--color-muted)] text-sm mb-8">
        Enter your order number and email to view status.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <Input
          label="Order Number"
          placeholder="TZ-260519-1234"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Searching..." : "Track Order"}
        </Button>
      </form>

      {error && <p className="text-red-400 text-center">{error}</p>}

      {order && (
        <div className="border border-[var(--color-border)] p-6 bg-[var(--color-surface-elevated)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-[var(--color-muted)] uppercase">Order</p>
              <p className="font-mono font-semibold">{order.orderNumber}</p>
            </div>
            <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>

          {order.status !== "cancelled" && (
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-zinc-800" />
              {STEPS.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center z-10">
                  <div
                    className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                      i <= currentStep
                        ? "bg-white border-white text-black"
                        : "bg-black border-zinc-700"
                    }`}
                  >
                    {i <= currentStep ? (
                      <Package className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3 text-zinc-600" />
                    )}
                  </div>
                  <span className="text-[9px] uppercase mt-2 text-center max-w-[60px] text-[var(--color-muted)]">
                    {getStatusLabel(step).split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>
          )}

          <ul className="space-y-2 text-sm border-t border-[var(--color-border)] pt-4 mb-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="font-semibold text-right">{formatCurrency(order.total)}</p>
          <p className="text-xs text-[var(--color-muted)] mt-4">
            Shipping to: {order.shippingAddress}, {order.city}
          </p>
        </div>
      )}
    </div>
  );
}
