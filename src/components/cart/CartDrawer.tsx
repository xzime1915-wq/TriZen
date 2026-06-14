"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCartUi } from "@/lib/cart-ui-store";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import { CartPanel } from "@/components/cart/CartPanel";

export function CartDrawer() {
  const pathname = usePathname();
  const isOpen = useCartUi((s) => s.isOpen);
  const closeCart = useCartUi((s) => s.closeCart);

  const hiddenRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart";

  useEffect(() => {
    if (!isOpen || hiddenRoute) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [hiddenRoute, isOpen]);

  useEffect(() => {
    if (hiddenRoute) closeCart();
  }, [closeCart, hiddenRoute]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeCart, isOpen]);

  if (hiddenRoute || !isOpen) return null;

  return (
    <div className="cart-drawer-root" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        className="cart-drawer-backdrop"
        onClick={closeCart}
        aria-label="Close cart"
      />
      <aside className="cart-drawer-panel">
        <CartPanel onClose={closeCart} />
      </aside>
    </div>
  );
}
