"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => setSignedIn(!!user))
      .catch(() => setSignedIn(false));
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-trizen py-20 text-center">
        <h1 className="text-2xl font-bold uppercase mb-4">Your Cart</h1>
        <p className="text-[var(--color-muted)] mb-8">Your cart is empty.</p>
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
        <div className="grid min-w-0 gap-6 lg:grid-cols-3 lg:gap-10">
          <div className="min-w-0 space-y-4 lg:col-span-2">
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
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="min-w-0 text-sm font-medium leading-snug sm:text-base">
                        {item.name}
                      </h3>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
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
          <div className="min-w-0 h-fit overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">
              Order Summary
            </h2>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-[var(--color-muted)]">Subtotal</span>
              <span className="shrink-0 tabular-nums">{formatCurrency(subtotal())}</span>
            </div>
            <p className="mb-6 text-xs leading-relaxed text-[var(--color-muted)]">
              ৳120 delivery charge added at checkout (COD)
            </p>
            <p className="mb-4 text-xs leading-relaxed text-[var(--color-muted)]">
              Sign in required to place an order.
            </p>
            <Link
              href={signedIn ? "/checkout" : "/sign-in?next=/checkout"}
              className="block min-w-0"
            >
              <Button className="w-full max-w-full whitespace-normal px-4 leading-snug tracking-wide">
                {signedIn === false ? "Sign in to Checkout" : "Proceed to Checkout"}
              </Button>
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-xs uppercase tracking-wide text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
