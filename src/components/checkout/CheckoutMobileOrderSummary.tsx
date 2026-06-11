"use client";

import type { CartItem } from "@/lib/cart-store";
import { CheckoutOrderSummaryPanel } from "./CheckoutOrderSummaryPanel";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
};

export function CheckoutMobileOrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
}: Props) {
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
