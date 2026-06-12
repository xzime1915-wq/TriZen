"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { DELIVERY_CHARGE, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/Button";
import { PaymentMethodId, buildPaymentRef, isBkashPayment } from "@/lib/checkout";
import {
  CheckoutBillingForm,
  type BillingFormState,
} from "@/components/checkout/CheckoutBillingForm";
import { CheckoutSection } from "@/components/checkout/CheckoutField";
import { CheckoutMobileCart } from "@/components/checkout/CheckoutMobileCart";
import { CheckoutUpsell } from "@/components/checkout/CheckoutUpsell";
import { CheckoutMobileOrderSummary } from "@/components/checkout/CheckoutMobileOrderSummary";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";
import { CheckoutSidebarEmpty } from "@/components/checkout/CheckoutSidebarEmpty";
import { PaymentMethodPicker } from "@/components/checkout/PaymentMethodPicker";
import {
  CheckoutEmailVerification,
  CheckoutVerifyFooter,
} from "@/components/checkout/CheckoutEmailVerification";

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cod");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form, setForm] = useState<BillingFormState>({
    fullName: "",
    customerPhone: "",
    customerEmail: "",
    streetAddress: "",
    district: "Dhaka",
    country: "Bangladesh",
    shipToDifferent: false,
    notes: "",
  });
  const [signedIn, setSignedIn] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initCheckout() {
      try {
        const meRes = await fetch("/api/auth/me");
        const { user } = await meRes.json();
        if (user && !cancelled) {
          setSignedIn(true);
          setForm((prev) => ({
            ...prev,
            fullName: prev.fullName || user.name || "",
            customerEmail: user.email || "",
          }));
        }
      } catch {
        /* ignore */
      }

      try {
        await fetch("/api/checkout/verify-email/reset", { method: "POST" });
      } catch {
        /* ignore */
      }

      if (!cancelled) setEmailVerified(false);
    }

    void initCheckout();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("payment") === "failed") {
      setError(searchParams.get("message") || "bKash payment failed. Please try again.");
      setPaymentMethod("bkash");
    }
  }, [searchParams]);

  const sub = subtotal();
  const total = sub + DELIVERY_CHARGE;
  const checkingEmail = emailVerified === null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="mb-6 text-zinc-600">Your cart is empty.</p>
          <Button onClick={() => router.push("/shop")}>Go to Shop</Button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!agreeTerms) {
      setError("Please agree to the terms and policies.");
      setLoading(false);
      return;
    }

    const orderPayload = {
      customerName: form.fullName.trim(),
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      shippingAddress: form.streetAddress.trim(),
      city: form.district,
      country: form.country || "Bangladesh",
      notes: form.notes || null,
      paymentMethod,
      paymentRef: buildPaymentRef(paymentMethod, {}),
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      if (isBkashPayment(paymentMethod)) {
        const res = await fetch("/api/payments/bkash/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "bKash payment failed");

        clearCart();
        window.location.href = data.bkashURL;
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(
        `/order-confirmation/${data.orderNumber}?email=${encodeURIComponent(form.customerEmail)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page bg-white">
      <div className="checkout-layout">
        <main className="checkout-main">
          <header className="checkout-main-header">
            <Link href="/" className="checkout-brand-wordmark">
              Trizen
            </Link>
          </header>

          {checkingEmail ? (
            <div className="checkout-form py-12 text-center text-sm text-zinc-500">
              Loading checkout...
            </div>
          ) : !emailVerified ? (
            <div className="checkout-verify-flow">
              <CheckoutEmailVerification
                email={form.customerEmail}
                signedIn={signedIn}
                onEmailChange={(customerEmail) =>
                  setForm((prev) => ({ ...prev, customerEmail }))
                }
                onVerified={() => setEmailVerified(true)}
              />
              <CheckoutMobileOrderSummary
                items={items}
                subtotal={sub}
                deliveryCharge={DELIVERY_CHARGE}
                total={total}
                empty
                showBack
              />
              <CheckoutVerifyFooter />
            </div>
          ) : (
            <>
          <div className="checkout-top-zone">
            <CheckoutUpsell />
            <CheckoutMobileCart />
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-form-fields">
              <CheckoutBillingForm
                form={form}
                onChange={setForm}
                emailReadOnly={signedIn || emailVerified === true}
              />

              <CheckoutSection title="Delivery method">
                <div className="checkout-delivery-method">
                  <span className="text-sm text-zinc-800">Nationwide delivery</span>
                  <span className="text-sm font-medium tabular-nums text-zinc-900">
                    {formatCurrency(DELIVERY_CHARGE)}
                  </span>
                </div>
              </CheckoutSection>

              <CheckoutSection
                title="Payment"
                subtitle="All transactions are secure. Choose how you want to pay."
              >
                <PaymentMethodPicker
                  method={paymentMethod}
                  onMethodChange={(id) => {
                    setPaymentMethod(id);
                    setError("");
                  }}
                  total={total}
                />
              </CheckoutSection>

              <label className="hidden cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-zinc-600 lg:flex">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-black"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-zinc-900 underline underline-offset-2">
                    Terms
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="text-zinc-900 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link href="/contact" className="text-zinc-900 underline underline-offset-2">
                    Refund Policy
                  </Link>
                </span>
              </label>
            </div>

            <div className="checkout-bottom-zone">
              <CheckoutMobileOrderSummary
                items={items}
                subtotal={sub}
                deliveryCharge={DELIVERY_CHARGE}
                total={total}
              />

              {error ? (
                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              ) : null}

              <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-zinc-600 lg:hidden">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-black"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-zinc-900 underline underline-offset-2">
                    Terms
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="text-zinc-900 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link href="/contact" className="text-zinc-900 underline underline-offset-2">
                    Refund Policy
                  </Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreeTerms}
                className="checkout-submit-btn"
              >
                {loading
                  ? paymentMethod === "bkash"
                    ? "Redirecting to bKash..."
                    : "Placing order..."
                  : paymentMethod === "bkash"
                    ? "Pay with bKash"
                    : "Place order"}
              </button>

              <footer className="checkout-footer-links lg:hidden">
                <Link href="/terms">Refund policy</Link>
                <Link href="/contact">Shipping</Link>
                <Link href="/privacy">Privacy policy</Link>
                <Link href="/terms">Terms of service</Link>
                <Link href="/contact">Contact</Link>
              </footer>
            </div>
          </form>
            </>
          )}
        </main>

        <aside className="checkout-sidebar">
          {emailVerified ? (
            <CheckoutSidebar
              items={items}
              subtotal={sub}
              deliveryCharge={DELIVERY_CHARGE}
              total={total}
            />
          ) : (
            <CheckoutSidebarEmpty />
          )}
        </aside>
      </div>
    </div>
  );
}
