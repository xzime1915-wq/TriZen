"use client";

import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-districts";
import {
  CheckoutInput,
  CheckoutSelect,
  CheckoutSection,
  CheckoutTextarea,
} from "./CheckoutField";
import { CheckoutPhoneInput } from "./CheckoutPhoneInput";

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
    <>
      <CheckoutSection title="Contact">
        <CheckoutInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          readOnly={emailReadOnly}
          value={form.customerEmail}
          onChange={(e) => set({ customerEmail: e.target.value })}
        />
        <CheckoutPhoneInput
          required
          value={form.customerPhone}
          onChange={(customerPhone) => set({ customerPhone })}
        />
      </CheckoutSection>

      <CheckoutSection title="Delivery">
        <CheckoutSelect
          label="Country / Region"
          value={form.country}
          onChange={(e) => set({ country: e.target.value })}
        >
          <option value="Bangladesh">Bangladesh</option>
        </CheckoutSelect>

        <CheckoutInput
          label="Name"
          placeholder="Name"
          required
          autoComplete="name"
          value={form.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
        />

        <CheckoutInput
          label="Address"
          placeholder="Address"
          required
          autoComplete="street address"
          value={form.streetAddress}
          onChange={(e) => set({ streetAddress: e.target.value })}
        />

        <CheckoutSelect
          label="District"
          required
          value={form.district}
          onChange={(e) => set({ district: e.target.value })}
        >
          {BANGLADESH_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </CheckoutSelect>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={form.shipToDifferent}
            onChange={(e) => set({ shipToDifferent: e.target.checked })}
            className="h-4 w-4 rounded border-zinc-300 accent-black"
          />
          Ship to a different address?
        </label>

        <CheckoutTextarea
          label="Order notes (optional)"
          value={form.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </CheckoutSection>
    </>
  );
}
