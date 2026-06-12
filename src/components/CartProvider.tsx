"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
    </>
  );
}
