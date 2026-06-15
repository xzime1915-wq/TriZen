export const STORE_CURRENCY = "BDT";
export const DELIVERY_CHARGE = 120;

export function formatCurrency(amount: number, currency = STORE_CURRENCY) {
  const formatted = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === "BDT") {
    return `${formatted} Taka`;
  }

  return formatted;
}

export function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const rand = Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 6)
    .toUpperCase();
  return `TZ-${y}${m}${d}-${rand}`;
}

export function generateInvoiceNumber(orderNumber: string) {
  return `INV-${orderNumber.replace("TZ-", "")}`;
}

export const ORDER_STATUSES = [
  { value: "pending_payment", label: "Pending Payment", color: "text-amber-400" },
  { value: "payment_received", label: "Payment Received", color: "text-blue-400" },
  { value: "processing", label: "Processing", color: "text-cyan-400" },
  { value: "shipped", label: "Shipped", color: "text-purple-400" },
  { value: "delivered", label: "Delivered", color: "text-emerald-400" },
  { value: "cancelled", label: "Cancelled", color: "text-red-400" },
] as const;

export function getStatusLabel(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function getStatusColor(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.color ?? "text-zinc-400";
}

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Replace em/en dashes in customer-facing copy with commas. */
export function sanitizeDisplayText(text: string) {
  return text
    .replace(/&mdash;|&ndash;/gi, " ")
    .replace(/\s*[\u2010\u2011\u2012\u2013\u2014\u2015]\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/,\s+\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function splitSanitizedParagraphs(text: string) {
  return text
    .split("\n\n")
    .map((paragraph) => sanitizeDisplayText(paragraph.trim()))
    .filter(Boolean);
}
