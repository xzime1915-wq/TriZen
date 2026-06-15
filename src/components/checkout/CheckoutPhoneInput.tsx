"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  formatBangladeshPhoneDisplay,
  formatBangladeshPhoneInput,
} from "@/lib/phone";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
  showError?: boolean;
};

export function CheckoutPhoneInput({
  value,
  onChange,
  required,
  error,
  showError,
}: Props) {
  const visibleError = showError && error;

  return (
    <label className="block">
      <span className="sr-only">Phone{required ? " (required)" : ""}</span>
      <div
        className={cn(
          "checkout-phone-field",
          visibleError ? "checkout-phone-field--invalid" : undefined
        )}
      >
        <span className="checkout-phone-prefix" aria-hidden="true">
          <Image
            src="/flags/bangladesh.png"
            alt=""
            width={18}
            height={12}
            className="checkout-phone-flag"
          />
          +880
        </span>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          className="checkout-phone-input"
          placeholder="Phone *"
          value={formatBangladeshPhoneDisplay(value)}
          onChange={(e) => onChange(formatBangladeshPhoneInput(e.target.value))}
          aria-invalid={visibleError ? true : undefined}
          aria-describedby={visibleError ? "checkout-phone-error" : undefined}
        />
      </div>
      {visibleError ? (
        <p id="checkout-phone-error" className="checkout-field-error">
          {error}
        </p>
      ) : null}
    </label>
  );
}
