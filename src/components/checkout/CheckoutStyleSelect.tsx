"use client";

import { ChevronDown } from "lucide-react";
import type { ProductColor } from "@/lib/product-data";

type Props = {
  options: ProductColor[];
  value?: string;
  onChange: (name: string) => void;
  label?: string;
};

export function CheckoutStyleSelect({
  options,
  value,
  onChange,
  label = "Size / Style",
}: Props) {
  const selected = value ?? options[0]?.name ?? "";

  return (
    <label className="checkout-action-box checkout-style-select">
      <span className="checkout-style-select-label">{label}</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="checkout-style-select-input"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.name} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
      <ChevronDown className="checkout-style-select-icon" strokeWidth={2} aria-hidden />
    </label>
  );
}
