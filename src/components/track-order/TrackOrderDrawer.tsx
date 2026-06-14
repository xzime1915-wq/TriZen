"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTrackOrderUi } from "@/lib/track-order-ui-store";
import { TrackOrderPanel } from "@/components/track-order/TrackOrderPanel";

export function TrackOrderDrawer() {
  const pathname = usePathname();
  const isOpen = useTrackOrderUi((s) => s.isOpen);
  const closeTrackOrder = useTrackOrderUi((s) => s.closeTrackOrder);
  const initialOrderNumber = useTrackOrderUi((s) => s.initialOrderNumber);
  const initialEmail = useTrackOrderUi((s) => s.initialEmail);

  const hiddenRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/checkout");

  useEffect(() => {
    if (!isOpen || hiddenRoute) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [hiddenRoute, isOpen]);

  useEffect(() => {
    if (hiddenRoute) closeTrackOrder();
  }, [closeTrackOrder, hiddenRoute]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeTrackOrder();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeTrackOrder, isOpen]);

  if (hiddenRoute || !isOpen) return null;

  return (
    <div
      className="cart-drawer-root"
      role="dialog"
      aria-modal="true"
      aria-label="Track order"
    >
      <button
        type="button"
        className="cart-drawer-backdrop"
        onClick={closeTrackOrder}
        aria-label="Close track order"
      />
      <aside className="cart-drawer-panel">
        <TrackOrderPanel
          onClose={closeTrackOrder}
          initialOrderNumber={initialOrderNumber}
          initialEmail={initialEmail}
        />
      </aside>
    </div>
  );
}
