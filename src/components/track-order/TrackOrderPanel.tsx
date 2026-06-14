"use client";

import { useEffect, useState } from "react";
import { X, Package, Clock } from "lucide-react";
import { formatCurrency, getStatusLabel, getStatusColor } from "@/lib/utils";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

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

type Props = {
  onClose: () => void;
  initialOrderNumber?: string;
  initialEmail?: string;
};

export function TrackOrderPanel({
  onClose,
  initialOrderNumber = "",
  initialEmail = "",
}: Props) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrderNumber(initialOrderNumber);
    setEmail(initialEmail);
    setOrder(null);
    setError("");
  }, [initialEmail, initialOrderNumber]);

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      void fetchOrder(initialOrderNumber, initialEmail);
    }
  }, [initialEmail, initialOrderNumber]);

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
    void fetchOrder();
  }

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="cart-panel cart-panel--drawer">
      <header className="cart-panel-header">
        <button
          type="button"
          onClick={onClose}
          className="cart-panel-close"
          aria-label="Close track order"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <h2 className="cart-panel-title">Track Order</h2>
        <span className="cart-panel-header-spacer" aria-hidden />
      </header>

      <div className="cart-panel-body" data-lenis-prevent>
        <p className="mb-6 text-sm text-black">
          Enter your order number and email to view status.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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

        {error ? <p className="mt-4 text-center text-sm text-red-500">{error}</p> : null}

        {order ? (
          <div className="mt-8 border border-zinc-200 p-5">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                  Order
                </p>
                <p className="font-mono text-sm font-semibold text-black">
                  {order.orderNumber}
                </p>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            {order.status !== "cancelled" ? (
              <div className="relative mb-8 flex justify-between">
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-zinc-200" />
                {STEPS.map((step, i) => (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        i <= currentStep
                          ? "border-black bg-black text-white"
                          : "border-zinc-300 bg-white text-zinc-400"
                      }`}
                    >
                      {i <= currentStep ? (
                        <Package className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                    </div>
                    <span className="mt-2 max-w-[60px] text-center text-[9px] uppercase text-zinc-500">
                      {getStatusLabel(step).split(" ")[0]}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            <ul className="mb-4 space-y-2 border-t border-zinc-200 pt-4 text-sm text-black">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="text-right font-semibold text-black">
              {formatCurrency(order.total)}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              Shipping to: {order.shippingAddress}, {order.city}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
