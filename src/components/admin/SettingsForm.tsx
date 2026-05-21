"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";

type Settings = {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
  paymentInstructions: string;
  shippingFlat: number;
  taxRate: number;
  currency: string;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState(settings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        shippingFlat: parseFloat(String(form.shippingFlat)),
        taxRate: parseFloat(String(form.taxRate)),
      }),
    });

    setLoading(false);
    setMessage(res.ok ? "Settings saved successfully" : "Failed to save settings");
  }

  function field(key: keyof Settings, label: string, type = "text") {
    return (
      <Input
        key={key}
        label={label}
        type={type}
        value={String(form[key])}
        onChange={(e) =>
          setForm({ ...form, [key]: type === "number" ? parseFloat(e.target.value) : e.target.value })
        }
        step={type === "number" ? "0.01" : undefined}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xs uppercase tracking-widest font-semibold">Store Info</h2>
        {field("storeName", "Store Name")}
        {field("tagline", "Tagline")}
        {field("email", "Email", "email")}
        {field("phone", "Phone")}
        <Textarea
          label="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </section>

      <section className="space-y-4 border-t border-[var(--color-border)] pt-8">
        <h2 className="text-xs uppercase tracking-widest font-semibold">Bank Payment Details</h2>
        {field("bankName", "Bank Name")}
        {field("accountName", "Account Name")}
        {field("accountNumber", "Account Number")}
        {field("routingNumber", "Routing Number")}
        {field("swiftCode", "SWIFT / BIC Code")}
        {field("iban", "IBAN (optional)")}
        <Textarea
          label="Payment Instructions"
          value={form.paymentInstructions}
          onChange={(e) => setForm({ ...form, paymentInstructions: e.target.value })}
        />
      </section>

      <section className="space-y-4 border-t border-[var(--color-border)] pt-8">
        <h2 className="text-xs uppercase tracking-widest font-semibold">Pricing</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("shippingFlat", "Flat Shipping Rate", "number")}
          {field("taxRate", "Tax Rate (e.g. 0.08 = 8%)", "number")}
          {field("currency", "Currency (BDT / Taka)")}
        </div>
      </section>

      {message && (
        <p className={message.includes("success") ? "text-emerald-400" : "text-red-400"}>
          {message}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
