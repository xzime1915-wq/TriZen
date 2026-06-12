"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-trizen py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold uppercase">Your Cart</h1>
        <p className="mb-8 text-[var(--color-muted)]">Your cart is empty.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="container-trizen max-w-full py-8 sm:py-12">
        <h1 className="mb-6 text-2xl font-bold uppercase tracking-wide sm:mb-8">Your Cart</h1>
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}${item.color ? `-${item.color}` : ""}`}
                className="overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"
              >
                <div className="flex min-w-0 gap-3 sm:gap-4">
                  <div className="relative h-20 w-20 shrink-0 border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-28 sm:w-28">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      sizes="112px"
                      className="p-2 sm:p-3"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="break-words text-sm font-medium leading-snug sm:text-base">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm font-semibold tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)] sm:text-sm">
                      {formatCurrency(item.price)} each
                    </p>
                    <div className="mt-3 flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        className="border border-[var(--color-border)] p-1 hover:border-white"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.color)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="border border-[var(--color-border)] p-1 hover:border-white"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.color)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto p-1 text-red-400 hover:text-red-300"
                        onClick={() => removeItem(item.productId, item.color)}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/checkout" className="block min-w-0">
              <Button className="w-full max-w-full whitespace-normal px-4 leading-snug tracking-wide">
                Proceed to Checkout
              </Button>
            </Link>
            <Link
              href="/shop"
              className="block text-center text-xs uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
