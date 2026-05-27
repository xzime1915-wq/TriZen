"use client";

import {
  PAYMENT_METHODS,
  PaymentMethodId,
  BankSettings,
  isMobileWallet,
  formatCheckoutPrice,
} from "@/lib/checkout";
import { CheckoutInput } from "./CheckoutField";

type Props = {
  method: PaymentMethodId;
  onMethodChange: (id: PaymentMethodId) => void;
  payerNumber: string;
  onPayerNumberChange: (v: string) => void;
  transactionId: string;
  onTransactionIdChange: (v: string) => void;
  total: number;
  bankSettings?: BankSettings | null;
};

export function PaymentMethodPicker({
  method,
  onMethodChange,
  payerNumber,
  onPayerNumberChange,
  transactionId,
  onTransactionIdChange,
  total,
  bankSettings,
}: Props) {
  return (
    <div className="space-y-5">
      {PAYMENT_METHODS.map((m) => (
        <div key={m.id}>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              checked={method === m.id}
              onChange={() => onMethodChange(m.id)}
              className="h-4 w-4 accent-white"
            />
            <span className="text-sm font-medium text-[var(--color-foreground)]">{m.label}</span>
          </label>

          {method === m.id && (
            <div className="mt-4 space-y-4 border-l-2 border-[var(--color-border)] pl-6">
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {m.instructions}
                {m.id !== "cod" && (
                  <>
                    {" "}
                    Total amount:{" "}
                    <strong className="text-[var(--color-foreground)]">{formatCheckoutPrice(total)}</strong>
                  </>
                )}
              </p>

              {m.id === "cod" && (
                <p className="text-sm text-[var(--color-foreground)]">
                  Order total on delivery:{" "}
                  <strong>{formatCheckoutPrice(total)}</strong>
                </p>
              )}

              {m.id === "bank" && bankSettings && (
                <div className="space-y-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
                  <p>
                    <span className="text-[var(--color-muted)]">Bank: </span>
                    {bankSettings.bankName}
                  </p>
                  <p>
                    <span className="text-[var(--color-muted)]">Account Name: </span>
                    {bankSettings.accountName}
                  </p>
                  <p>
                    <span className="text-[var(--color-muted)]">Account Number: </span>
                    {bankSettings.accountNumber}
                  </p>
                  {bankSettings.routingNumber && (
                    <p>
                      <span className="text-[var(--color-muted)]">Routing: </span>
                      {bankSettings.routingNumber}
                    </p>
                  )}
                  {bankSettings.swiftCode && (
                    <p>
                      <span className="text-[var(--color-muted)]">SWIFT: </span>
                      {bankSettings.swiftCode}
                    </p>
                  )}
                  {bankSettings.iban && (
                    <p>
                      <span className="text-[var(--color-muted)]">IBAN: </span>
                      {bankSettings.iban}
                    </p>
                  )}
                  {bankSettings.paymentInstructions && (
                    <p className="pt-2 text-[var(--color-muted)]">
                      {bankSettings.paymentInstructions}
                    </p>
                  )}
                </div>
              )}

              {m.id === "bank" && (
                <CheckoutInput
                  label="Payment Reference / Transaction ID"
                  placeholder="Enter after bank transfer"
                  value={transactionId}
                  onChange={(e) => onTransactionIdChange(e.target.value)}
                />
              )}

              {isMobileWallet(m.id) && m.personalNumber && (
                <>
                  <p className="text-sm text-[var(--color-muted)]">
                    <span className="font-medium text-[var(--color-foreground)]">{m.label} Personal Number:</span>{" "}
                    {m.personalNumber}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CheckoutInput
                      label={`${m.label} Number`}
                      placeholder="017XXXXXXXX"
                      value={payerNumber}
                      onChange={(e) => onPayerNumberChange(e.target.value)}
                      required
                    />
                    <CheckoutInput
                      label={`${m.label} Transaction ID`}
                      placeholder="BN7A6D5EE7M"
                      value={transactionId}
                      onChange={(e) => onTransactionIdChange(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
