"use client";

export function CheckoutSidebarEmpty() {
  return (
    <div className="checkout-sidebar-inner checkout-sidebar-empty">
      <h2 className="checkout-order-summary-title">Order summary</h2>
      <p className="checkout-sidebar-empty-text">Your cart is empty.</p>
    </div>
  );
}
