"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { DELIVERY_CHARGE } from "@/lib/utils";
import { Button } from "@/components/Button";
import {
  PaymentMethodId,
  BankSettings,
  buildPaymentRef,
  isMobileWallet,
} from "@/lib/checkout";
import {
  CheckoutBillingForm,
  type BillingFormState,
} from "@/components/checkout/CheckoutBillingForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("cod");
  const [payerNumber, setPayerNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [bankSettings, setBankSettings] = useState<BankSettings | null>(null);
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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(({ user }) => {
        if (!user) return;
        setSignedIn(true);
        setForm((prev) => ({
          ...prev,
          fullName: prev.fullName || user.name || "",
          customerEmail: user.email || "",
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.bankName) {
          setBankSettings({
            bankName: data.bankName,
            accountName: data.accountName,
            accountNumber: data.accountNumber,
            routingNumber: data.routingNumber,
            swiftCode: data.swiftCode,
            iban: data.iban,
            paymentInstructions: data.paymentInstructions,
          });
        }
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) {
    return (
      <div className="container-trizen py-20 text-center">
        <p className="text-[var(--color-muted)] mb-6">Your cart is empty.</p>
        <Button onClick={() => router.push("/shop")}>Go to Shop</Button>
      </div>
    );
  }

  const sub = subtotal();
  const total = sub + DELIVERY_CHARGE;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!agreeTerms) {
      setError("Please agree to the terms and policies.");
      setLoading(false);
      return;
    }

    if (
      isMobileWallet(paymentMethod) &&
      (!payerNumber.trim() || !transactionId.trim())
    ) {
      const label = paymentMethod === "bkash" ? "bKash" : "Nagad";
      setError(`Please enter your ${label} number and transaction ID.`);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.fullName.trim(),
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          shippingAddress: form.streetAddress.trim(),
          city: form.district,
          country: form.country || "Bangladesh",
          notes: form.notes || null,
          paymentMethod,
          paymentRef: buildPaymentRef(paymentMethod, { payerNumber, transactionId }),
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/order-confirmation/${data.orderNumber}?email=${encodeURIComponent(form.customerEmail)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-trizen py-10 pb-16">
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-white hover:underline">
          Home
        </Link>
        <span className="mx-2 text-[var(--color-muted)]">&gt;</span>
        <span className="text-[var(--color-muted)]">Checkout</span>
      </nav>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Billing — left */}
          <div className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 sm:p-8">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest">Billing details</h2>
            <CheckoutBillingForm form={form} onChange={setForm} emailReadOnly={signedIn} />
          </div>

          {/* Order — right */}
          <div className="border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 sm:p-8 lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-widest">Your order</h2>
            <CheckoutOrderSummary
              items={items}
              subtotal={sub}
              deliveryCharge={DELIVERY_CHARGE}
              total={total}
              paymentMethod={paymentMethod}
              onPaymentChange={(id) => {
                setPaymentMethod(id);
                setPayerNumber("");
                setTransactionId("");
                setError("");
              }}
              payerNumber={payerNumber}
              onPayerNumberChange={setPayerNumber}
              transactionId={transactionId}
              onTransactionIdChange={setTransactionId}
              bankSettings={bankSettings}
              agreeTerms={agreeTerms}
              onAgreeTermsChange={setAgreeTerms}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
