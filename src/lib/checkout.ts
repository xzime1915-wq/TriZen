export type PaymentMethodId = "cod" | "bkash" | "bank";

export function isBkashPayment(id: PaymentMethodId) {
  return id === "bkash";
}

export type BankSettings = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode: string;
  iban: string;
  paymentInstructions: string;
};

/** Checkout: COD + bKash merchant checkout */
export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  instructions: string;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    instructions:
      "Pay with cash when your order is delivered. No advance payment required.",
  },
  {
    id: "bkash",
    label: "bKash",
    instructions:
      "Pay securely with bKash. You will be redirected to the bKash app or website to complete payment.",
  },
];

export function getPaymentMethodLabel(id: PaymentMethodId) {
  if (id === "bank") return "Bank Payment";
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;
}

export function formatCheckoutPrice(amount: number) {
  return `${Math.round(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}৳`;
}

export function buildPaymentRef(
  methodId: PaymentMethodId,
  data: { payerNumber?: string; transactionId?: string }
) {
  if (methodId === "cod") return null;

  if (methodId === "bank") {
    return data.transactionId?.trim()
      ? `Bank Transfer | Ref: ${data.transactionId.trim()}`
      : null;
  }

  return null;
}
