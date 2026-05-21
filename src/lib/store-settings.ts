import type { StoreSettings } from "@prisma/client";

/** Fields safe to expose on checkout (bank details needed for transfers). */
export function toCheckoutSettings(settings: StoreSettings | null) {
  if (!settings) return null;
  return {
    storeName: settings.storeName,
    currency: settings.currency,
    shippingFlat: settings.shippingFlat,
    taxRate: settings.taxRate,
    paymentInstructions: settings.paymentInstructions,
    bankName: settings.bankName,
    accountName: settings.accountName,
    accountNumber: settings.accountNumber,
    routingNumber: settings.routingNumber,
    swiftCode: settings.swiftCode,
    iban: settings.iban,
  };
}

const SETTINGS_PATCH_KEYS = [
  "storeName",
  "tagline",
  "email",
  "phone",
  "address",
  "bankName",
  "accountName",
  "accountNumber",
  "routingNumber",
  "swiftCode",
  "iban",
  "paymentInstructions",
  "shippingFlat",
  "taxRate",
  "currency",
] as const;

export function pickSettingsUpdate(body: Record<string, unknown>) {
  const update: Record<string, string | number> = {};
  for (const key of SETTINGS_PATCH_KEYS) {
    if (body[key] === undefined) continue;
    const value = body[key];
    if (key === "shippingFlat" || key === "taxRate") {
      const num = Number(value);
      if (!Number.isFinite(num) || num < 0) continue;
      update[key] = num;
    } else if (typeof value === "string") {
      update[key] = value.trim();
    }
  }
  return update;
}
