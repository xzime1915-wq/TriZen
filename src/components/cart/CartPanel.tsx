"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { ProductImage } from "@/components/ProductImage";
import { Button } from "@/components/Button";
import { useCart } from "@/lib/cart-store";
import { useCartUi } from "@/lib/cart-ui-store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  onClose?: () => void;
  variant?: "drawer" | "page";
};

export function CartPanel({ onClose, variant = "drawer" }: Props) {
  const router = useRouter();
  const closeCart = useCartUi((s) => s.closeCart);
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const count = totalItems();
  const total = subtotal();

  function handleClose() {
    onClose?.();
    if (variant === "drawer") {
      closeCart();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/shop");
  }

  return (
    <div className={`cart-panel cart-panel--${variant}`}>
      <header className="cart-panel-header">
        <button
          type="button"
          onClick={handleClose}
          className="cart-panel-close"
          aria-label="Close cart"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <h2 className="cart-panel-title">
          <ShoppingBag className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
          <span>Cart{count > 0 ? ` (${count})` : ""}</span>
        </h2>
        <span className="cart-panel-header-spacer" aria-hidden />
      </header>

      <div
        className={cn("cart-panel-body", items.length === 0 && "cart-panel-body--empty")}
        data-lenis-prevent
      >
        {items.length === 0 ? (
          <div className="cart-panel-empty">
            <p className="cart-panel-empty-text">Your cart is empty</p>
            <Link
              href="/shop"
              className="cart-panel-empty-btn trizen-sweep-dark"
              onClick={handleClose}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <ul className="cart-panel-items">
            {items.map((item) => (
              <li
                key={`${item.productId}${item.color ? `-${item.color}` : ""}`}
                className="cart-panel-item"
              >
                <div className="cart-panel-item-thumb">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    sizes="80px"
                    className="p-1.5"
                  />
                </div>
                <div className="cart-panel-item-main">
                  <div className="cart-panel-item-top">
                    <p className="cart-panel-item-name">
                      {item.name}
                    </p>
                    <p className="cart-panel-item-price">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="cart-panel-item-actions">
                    <div className="cart-panel-qty">
                      <button
                        type="button"
                        className="cart-panel-qty-btn"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.color)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="cart-panel-qty-value">{item.quantity}</span>
                      <button
                        type="button"
                        className="cart-panel-qty-btn"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.color)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-panel-remove"
                      onClick={() => removeItem(item.productId, item.color)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length > 0 ? (
        <footer className="cart-panel-footer">
          <div className="cart-panel-total-row">
            <span className="cart-panel-total-label">Total</span>
            <span className="cart-panel-total-value">{formatCurrency(total)}</span>
          </div>
          <p className="cart-panel-note">Delivery calculated at checkout.</p>
          <Link href="/checkout" className="block" onClick={handleClose}>
            <Button className="w-full">Checkout</Button>
          </Link>
          <button type="button" onClick={handleClose} className="cart-panel-continue">
            Continue Shopping
          </button>
        </footer>
      ) : null}
    </div>
  );
}
