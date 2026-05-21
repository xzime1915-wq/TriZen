export type PaymentMethodId = "cod" | "bank" | "bkash" | "nagad";

export const MOBILE_WALLETS: PaymentMethodId[] = ["bkash", "nagad"];

export function isMobileWallet(id: PaymentMethodId) {
  return MOBILE_WALLETS.includes(id);
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

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  instructions: string;
  personalNumber?: string;
}[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    instructions:
      "Pay with cash when your order is delivered. No advance payment required.",
  },
  {
    id: "bank",
    label: "Bank Payment",
    instructions:
      "Transfer the total amount to our bank account below. Use your order number as the payment reference.",
  },
  {
    id: "bkash",
    label: "bKash",
    personalNumber: process.env.NEXT_PUBLIC_BKASH_NUMBER || "",
    instructions:
      "To pay, use the 'Send Money' option in bKash, then fill in your bKash number and transaction ID below.",
  },
  {
    id: "nagad",
    label: "Nagad",
    personalNumber: process.env.NEXT_PUBLIC_NAGAD_NUMBER || "",
    instructions:
      "Send payment via Nagad, then fill in your Nagad number and transaction ID below.",
  },
];

export function formatCheckoutPrice(amount: number) {
  return `${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}৳`;
}

export function buildPaymentRef(
  methodId: PaymentMethodId,
  data: { payerNumber?: string; transactionId?: string }
) {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId)!;

  if (methodId === "cod") return null;

  if (methodId === "bank") {
    return data.transactionId?.trim()
      ? `Bank Transfer | Ref: ${data.transactionId.trim()}`
      : null;
  }

  if (isMobileWallet(methodId) && data.payerNumber?.trim() && data.transactionId?.trim()) {
    return `${method.label}: ${data.payerNumber.trim()} | TXN: ${data.transactionId.trim()}`;
  }

  return null;
}
