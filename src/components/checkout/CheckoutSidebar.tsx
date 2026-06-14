"use client";

import type { CartItem } from "@/lib/cart-store";
import { CheckoutOrderSummaryPanel } from "./CheckoutOrderSummaryPanel";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  paymentSurcharge?: number;
  total: number;
};

export function CheckoutSidebar({ items, subtotal, deliveryCharge, paymentSurcharge = 0, total }: Props) {
  return (
    <div className="checkout-sidebar-inner">
      <CheckoutOrderSummaryPanel
        items={items}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        paymentSurcharge={paymentSurcharge}
        total={total}
      />
    </div>
  );
}
