"use client";

import type { CartItem } from "@/lib/cart-store";
import { CheckoutOrderSummaryPanel } from "./CheckoutOrderSummaryPanel";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
};

export function CheckoutSidebar({ items, subtotal, deliveryCharge, total }: Props) {
  return (
    <div className="checkout-sidebar-inner">
      <CheckoutOrderSummaryPanel
        items={items}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
        hideTitle
      />
    </div>
  );
}
