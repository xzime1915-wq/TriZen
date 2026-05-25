"use client";

import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-districts";
import { CheckoutInput, CheckoutTextarea } from "./CheckoutField";

export type BillingFormState = {
  fullName: string;
  customerPhone: string;
  customerEmail: string;
  streetAddress: string;
  district: string;
  country: string;
  shipToDifferent: boolean;
  notes: string;
};

type Props = {
  form: BillingFormState;
  onChange: (form: BillingFormState) => void;
  emailReadOnly?: boolean;
};

export function CheckoutBillingForm({ form, onChange, emailReadOnly = false }: Props) {
  const set = (patch: Partial<BillingFormState>) => onChange({ ...form, ...patch });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutInput
          label="Full Name"
          required
          value={form.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
        />
        <CheckoutInput
          label="Phone"
          type="tel"
          required
          value={form.customerPhone}
          onChange={(e) => set({ customerPhone: e.target.value })}
        />
      </div>

      <CheckoutInput
        label="Address"
        required
        value={form.streetAddress}
        onChange={(e) => set({ streetAddress: e.target.value })}
      />

      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wider text-[var(--color-muted)]">
          District <span className="text-red-400">*</span>
        </span>
        <select
          required
          value={form.district}
          onChange={(e) => set({ district: e.target.value })}
          className="w-full border border-[var(--color-border)] bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-white"
        >
          {BANGLADESH_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <CheckoutInput
        label="Country (optional)"
        value={form.country}
        onChange={(e) => set({ country: e.target.value })}
      />

      <CheckoutInput
        label="Email address"
        type="email"
        required
        readOnly={emailReadOnly}
        value={form.customerEmail}
        onChange={(e) => set({ customerEmail: e.target.value })}
      />

      <div className="pt-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={form.shipToDifferent}
            onChange={(e) => set({ shipToDifferent: e.target.checked })}
            className="h-4 w-4 accent-white"
          />
          Ship to a different address?
        </label>
      </div>

      <CheckoutTextarea
        label="Order notes (optional)"
        placeholder="Notes about your order, e.g. special notes for delivery."
        value={form.notes}
        onChange={(e) => set({ notes: e.target.value })}
      />
    </div>
  );
}
