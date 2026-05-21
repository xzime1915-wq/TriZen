"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/lib/cart-store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

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
    <div className="container-trizen py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}${item.color ? `-${item.color}` : ""}`}
              className="flex gap-4 border border-[var(--color-border)] p-4 bg-[var(--color-surface-elevated)]"
            >
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 bg-black border border-[var(--color-border)]">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  sizes="128px"
                  className="p-2 sm:p-3"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {formatCurrency(item.price)} each
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    type="button"
                    className="p-1 border border-[var(--color-border)] hover:border-white"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1, item.color)
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    className="p-1 border border-[var(--color-border)] hover:border-white"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1, item.color)
                    }
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
              <p className="font-semibold shrink-0">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border border-[var(--color-border)] p-6 h-fit bg-[var(--color-surface-elevated)]">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span>{formatCurrency(subtotal())}</span>
          </div>
          <p className="text-xs text-[var(--color-muted)] mb-6">
            ৳120 delivery charge added at checkout (COD)
          </p>
          <Link href="/checkout" className="block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
          <Link href="/shop" className="block mt-3 text-center text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-white">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
