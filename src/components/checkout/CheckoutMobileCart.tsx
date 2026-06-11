"use client";

import { useState } from "react";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatCheckoutPrice } from "@/lib/checkout";
import { CheckoutCartItemCard } from "@/components/checkout/CheckoutCartItemCard";

export function CheckoutMobileCart() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const updateQuantity = useCart((s) => s.updateQuantity);
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-cart-section">
      {items.map((item) => (
        <CheckoutCartItemCard
          key={`${item.productId}${item.color ? `-${item.color}` : ""}`}
          item={item}
        />
      ))}

      <div className="checkout-cart-collapsible">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="checkout-cart-collapsible-toggle"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            Your products
            <span className="text-zinc-500">
              · {itemCount} item{itemCount !== 1 ? "s" : ""}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold tabular-nums text-zinc-900">
              {formatCheckoutPrice(subtotal)}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
              strokeWidth={2}
              aria-hidden
            />
          </span>
        </button>

        {open ? (
          <div className="checkout-cart-collapsible-body">
            {items.map((item) => (
              <div
                key={`qty-${item.productId}${item.color ? `-${item.color}` : ""}`}
                className="checkout-cart-qty-row"
              >
                <p className="min-w-0 truncate text-sm text-zinc-700">{item.name}</p>
                <div className="flex items-center gap-3">
                  <div className="checkout-qty-stepper">
                    <button
                      type="button"
                      className="checkout-qty-btn"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1, item.color)
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                    <span className="checkout-qty-value">{item.quantity}</span>
                    <button
                      type="button"
                      className="checkout-qty-btn"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1, item.color)
                      }
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold tabular-nums text-zinc-900">
                    {formatCheckoutPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
