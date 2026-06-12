"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CartItem } from "@/lib/cart-store";
import { CheckoutOrderSummaryPanel } from "./CheckoutOrderSummaryPanel";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  empty?: boolean;
};

export function CheckoutMobileOrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  empty = false,
}: Props) {
  const [open, setOpen] = useState(true);

  if (empty) {
    return (
      <div className="checkout-mobile-order-summary lg:hidden">
        <div className="checkout-order-summary-accordion">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="checkout-order-summary-accordion-toggle"
            aria-expanded={open}
          >
            <span className="text-sm font-medium text-zinc-900">Order summary</span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          {open ? (
            <div className="checkout-order-summary-accordion-body">
              <p className="text-sm text-zinc-400">Your cart is empty</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-mobile-order-summary lg:hidden">
      <CheckoutOrderSummaryPanel
        items={items}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
      />
    </div>
  );
}
