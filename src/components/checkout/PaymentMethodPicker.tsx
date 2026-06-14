"use client";

import Image from "next/image";
import { PaymentMethodId, BKASH_MERCHANT_CHARGE, formatCheckoutPrice } from "@/lib/checkout";
import { cn } from "@/lib/utils";

type Props = {
  method: PaymentMethodId;
  onMethodChange: (id: PaymentMethodId) => void;
  total: number;
};

export function PaymentMethodPicker({ method, onMethodChange, total }: Props) {
  return (
    <div className="checkout-payment-box">
      <label
        className={cn(
          "checkout-payment-row",
          method === "cod" && "checkout-payment-row--active"
        )}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={method === "cod"}
          onChange={() => onMethodChange("cod")}
          className="checkout-payment-radio"
        />
        <span className="flex-1 text-sm font-medium text-zinc-900">Cash on Delivery</span>
      </label>

      {method === "cod" && (
        <div className="checkout-payment-expand">
          <p className="text-sm text-zinc-600">
            Pay <strong className="text-zinc-900">{formatCheckoutPrice(total)}</strong> when your
            order is delivered.
          </p>
        </div>
      )}

      <label
        className={cn(
          "checkout-payment-row border-t border-zinc-200",
          method === "bkash" && "checkout-payment-row--active"
        )}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={method === "bkash"}
          onChange={() => onMethodChange("bkash")}
          className="checkout-payment-radio"
        />
        <span className="flex-1 text-sm font-medium text-zinc-900">bKash</span>
        <Image
          src="/payments/bkash.png"
          alt="bKash"
          width={48}
          height={28}
          className="h-6 w-auto object-contain"
        />
      </label>

      {method === "bkash" && (
        <div className="checkout-payment-expand">
          <p className="text-sm text-zinc-600">
            Pay <strong className="text-zinc-900">{formatCheckoutPrice(total)}</strong> with bKash
            (includes {formatCheckoutPrice(BKASH_MERCHANT_CHARGE)} merchant charge). After placing
            your order, you&apos;ll be redirected to bKash to complete payment automatically.
          </p>
        </div>
      )}
    </div>
  );
}
