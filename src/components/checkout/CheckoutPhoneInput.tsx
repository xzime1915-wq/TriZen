"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  bangladeshPhoneError,
  formatBangladeshPhoneDisplay,
  formatBangladeshPhoneInput,
  isValidBangladeshPhone,
} from "@/lib/phone";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function CheckoutPhoneInput({ value, onChange, required }: Props) {
  const [touched, setTouched] = useState(false);
  const error = touched ? bangladeshPhoneError(value) : null;
  const valid = value.length > 0 && isValidBangladeshPhone(value);

  return (
    <label className="block">
      <span className="sr-only">Phone{required ? " (required)" : ""}</span>
      <div
        className={cn(
          "checkout-phone-field",
          error ? "checkout-phone-field--invalid" : undefined,
          valid ? "checkout-phone-field--valid" : undefined
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
          placeholder="01XXX XXXXXX"
          value={formatBangladeshPhoneDisplay(value)}
          onChange={(e) => onChange(formatBangladeshPhoneInput(e.target.value))}
          onBlur={() => setTouched(true)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "checkout-phone-error" : undefined}
        />
      </div>
      {error ? (
        <p id="checkout-phone-error" className="checkout-phone-hint checkout-phone-hint--error">
          {error}
        </p>
      ) : null}
    </label>
  );
}
