"use client";

import Link from "next/link";
import {
  PAYMENT_METHODS,
  PaymentMethodId,
  BankSettings,
  isMobileWallet,
  formatCheckoutPrice,
} from "@/lib/checkout";
import { CheckoutInput } from "./CheckoutField";
import type { CartItem } from "@/lib/cart-store";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethodId;
  onPaymentChange: (id: PaymentMethodId) => void;
  payerNumber: string;
  onPayerNumberChange: (v: string) => void;
  transactionId: string;
  onTransactionIdChange: (v: string) => void;
  bankSettings: BankSettings | null;
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
  payerNumber,
  onPayerNumberChange,
  transactionId,
  onTransactionIdChange,
  bankSettings,
  agreeTerms,
  onAgreeTermsChange,
  loading,
  error,
}: Props) {
  const selected = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!;

  return (
    <div className="space-y-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wider text-[var(--color-muted)]">
            <th className="pb-3 font-semibold">Product</th>
            <th className="pb-3 text-right font-semibold">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.productId} className="border-b border-[var(--color-border)]">
              <td className="py-3 pr-2 text-[var(--color-muted)]">
                {item.name} × {item.quantity}
              </td>
              <td className="py-3 text-right whitespace-nowrap">
                {formatCheckoutPrice(item.price * item.quantity)}
              </td>
            </tr>
          ))}
          <tr className="border-b border-[var(--color-border)]">
            <td className="py-3 text-[var(--color-muted)]">Subtotal</td>
            <td className="py-3 text-right">{formatCheckoutPrice(subtotal)}</td>
          </tr>
        </tbody>
      </table>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Delivery
        </p>
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="radio"
            name="shipment"
            checked
            readOnly
            className="mt-1 h-4 w-4 accent-white"
          />
          <span>
            Delivery charge:{" "}
            <strong className="text-white">{formatCheckoutPrice(deliveryCharge)}</strong>
          </span>
        </label>
      </div>

      <div className="flex justify-between border-t border-[var(--color-border)] pt-4 text-base font-bold">
        <span>Total</span>
        <span className="text-lg">{formatCheckoutPrice(total)}</span>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          Payment
        </p>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((m) => (
            <div key={m.id}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === m.id}
                  onChange={() => onPaymentChange(m.id)}
                  className="h-4 w-4 shrink-0 accent-white"
                />
                <span className="text-sm">{m.label}</span>
              </label>

              {paymentMethod === m.id && (
                <div className="mt-3 ml-6 space-y-3 rounded border border-[var(--color-border)] bg-black/50 p-4 text-sm text-[var(--color-muted)]">
                  <p>{m.instructions}</p>

                  {m.id === "cod" && (
                    <p className="text-white">
                      Pay <strong>{formatCheckoutPrice(total)}</strong> on delivery.
                    </p>
                  )}

                  {m.id === "bank" && bankSettings && (
                    <div className="space-y-1 text-xs">
                      <p>
                        <span className="text-[var(--color-muted)]">Bank:</span> {bankSettings.bankName}
                      </p>
                      <p>
                        <span className="text-[var(--color-muted)]">Account:</span>{" "}
                        {bankSettings.accountName} — {bankSettings.accountNumber}
                      </p>
                    </div>
                  )}

                  {m.id === "bank" && (
                    <CheckoutInput
                      label="Payment Reference"
                      placeholder="Transaction ID after transfer"
                      value={transactionId}
                      onChange={(e) => onTransactionIdChange(e.target.value)}
                    />
                  )}

                  {isMobileWallet(m.id) && m.personalNumber && (
                    <>
                      <p>
                        <span className="text-white">{m.label} Number:</span> {m.personalNumber}
                      </p>
                      <CheckoutInput
                        label={`${m.label} Number`}
                        placeholder="017XXXXXXXX"
                        value={payerNumber}
                        onChange={(e) => onPayerNumberChange(e.target.value)}
                        required
                      />
                      <CheckoutInput
                        label={`${m.label} Transaction ID`}
                        placeholder="BN7A6D5EE7M"
                        value={transactionId}
                        onChange={(e) => onTransactionIdChange(e.target.value)}
                        required
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <label className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-[var(--color-muted)]">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => onAgreeTermsChange(e.target.checked)}
          required
          className="mt-0.5 h-4 w-4 shrink-0 accent-white"
        />
        <span>
          I have read and agree to the website{" "}
          <Link href="/contact" className="font-semibold text-white hover:underline">
            Terms & Conditions
          </Link>
          ,{" "}
          <Link href="/contact" className="font-semibold text-white hover:underline">
            Privacy Policy
          </Link>
          , and{" "}
          <Link href="/contact" className="font-semibold text-white hover:underline">
            Refund Policy
          </Link>
          <span className="text-red-400"> *</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading || !agreeTerms}
        className="w-full bg-white py-4 text-sm font-bold uppercase tracking-widest text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
