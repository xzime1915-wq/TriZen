"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { TrackOrderDrawer } from "@/components/track-order/TrackOrderDrawer";

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
      <TrackOrderDrawer />
    </>
  );
}
