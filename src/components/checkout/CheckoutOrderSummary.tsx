"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { PaymentMethodId, formatCheckoutPrice } from "@/lib/checkout";
import { PaymentMethodPicker } from "./PaymentMethodPicker";
import { CheckoutPanel } from "./CheckoutPanel";
import type { CartItem } from "@/lib/cart-store";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethodId;
  onPaymentChange: (id: PaymentMethodId) => void;
  agreeTerms: boolean;
  onAgreeTermsChange: (v: boolean) => void;
  loading: boolean;
  error: string;
};

export function CheckoutOrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  paymentMethod,
  onPaymentChange,
  agreeTerms,
  onAgreeTermsChange,
  loading,
  error,
}: Props) {
  return (
    <div className="space-y-5">
      <CheckoutPanel
        step="02"
        title="Your order"
        description="Review items and delivery before payment."
      >
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex items-start justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-zinc-50 px-3 py-3 sm:px-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-foreground)]">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">Qty: {item.quantity}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-[var(--color-foreground)]">
                {formatCheckoutPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
          <div className="flex justify-between text-[var(--color-muted)]">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCheckoutPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-zinc-50 px-3 py-2.5">
            <span className="flex items-center gap-2 text-[var(--color-muted)]">
              <Truck className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Delivery
            </span>
            <span className="font-medium tabular-nums text-[var(--color-foreground)]">
              {formatCheckoutPrice(deliveryCharge)}
            </span>
          </div>
          <div className="checkout-total-row flex justify-between rounded-lg border border-black bg-black px-3 py-3 text-base font-bold text-white">
            <span>Total</span>
            <span className="text-lg tabular-nums">{formatCheckoutPrice(total)}</span>
          </div>
        </div>
      </CheckoutPanel>

      <CheckoutPanel
        step="03"
        title="Payment method"
        description="Choose how you want to pay for this order."
      >
        <PaymentMethodPicker
          method={paymentMethod}
          onMethodChange={onPaymentChange}
          total={total}
        />
      </CheckoutPanel>

      <CheckoutPanel step="04" title="Confirm order" description="Agree to our policies and place your order.">
        {error ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--color-border)] bg-zinc-50 px-3 py-3 text-xs leading-relaxed text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => onAgreeTermsChange(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-black"
          />
          <span>
            I have read and agree to the website{" "}
            <Link href="/terms" className="font-semibold text-[var(--color-foreground)] hover:underline">
              Terms & Conditions
            </Link>
            ,{" "}
            <Link href="/privacy" className="font-semibold text-[var(--color-foreground)] hover:underline">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/contact" className="font-semibold text-[var(--color-foreground)] hover:underline">
              Refund Policy
            </Link>
            <span className="text-red-400"> *</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !agreeTerms}
          className="trizen-btn-primary mt-4 w-full !py-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </CheckoutPanel>
    </div>
  );
}
