"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { CartItem } from "@/lib/cart-store";
import { CheckoutOrderSummaryPanel } from "./CheckoutOrderSummaryPanel";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  empty?: boolean;
  showBack?: boolean;
};

export function CheckoutMobileOrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  empty = false,
  showBack = false,
}: Props) {
  const [open, setOpen] = useState(true);

  if (empty) {
    return (
      <div className="checkout-mobile-order-summary checkout-mobile-order-summary--verify lg:hidden">
        <div className="checkout-order-summary-accordion">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="checkout-order-summary-accordion-toggle"
            aria-expanded={open}
          >
            <span className="checkout-order-summary-accordion-label">Order summary</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>
          {open ? (
            <div className="checkout-order-summary-accordion-body">
              <p className="checkout-order-summary-empty-text">Your cart is empty</p>
              {showBack ? (
                <Link href="/cart" className="checkout-order-summary-back">
                  Back
                </Link>
              ) : null}
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
