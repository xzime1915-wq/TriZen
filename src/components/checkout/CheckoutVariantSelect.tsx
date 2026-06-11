"use client";

import { ChevronDown } from "lucide-react";
import type { ProductColor } from "@/lib/product-data";

type Props = {
  options: ProductColor[];
  value?: string;
  onChange: (name: string) => void;
  label?: string;
};

export function CheckoutVariantSelect({
  options,
  value,
  onChange,
  label = "Edition",
}: Props) {
  if (options.length <= 1) return null;

  return (
    <label className="checkout-variant-select">
      <span className="sr-only">{label}</span>
      <select
        value={value ?? options[0]?.name ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="checkout-variant-select-input"
      >
        {options.map((opt) => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
      <ChevronDown className="checkout-variant-select-icon" strokeWidth={2} aria-hidden />
    </label>
  );
}
