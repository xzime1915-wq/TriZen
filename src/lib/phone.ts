import { normalizePhone } from "@/lib/customers";

/** BD mobile: 01[3-9] followed by 8 digits (11 total). */
export const BD_MOBILE_RE = /^01[3-9]\d{8}$/;

export function formatBangladeshPhoneInput(raw: string): string {
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("880")) {
    digits = "0" + digits.slice(3);
  } else if (digits.startsWith("88") && digits.length > 2) {
    digits = "0" + digits.slice(2);
  } else if (digits.length > 0 && !digits.startsWith("0")) {
    digits = "0" + digits;
  }

  return digits.slice(0, 11);
}

export function isValidBangladeshPhone(phone: string): boolean {
  return BD_MOBILE_RE.test(normalizePhone(phone));
}

export function formatBangladeshPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  if (!normalized) return "";
  if (normalized.length <= 5) return normalized;
  return `${normalized.slice(0, 5)} ${normalized.slice(5)}`;
}

export function bangladeshPhoneError(phone: string): string | null {
  const normalized = formatBangladeshPhoneInput(phone);
  if (!normalized) return "Phone number is required";
  if (normalized.length < 11) return "Enter an 11-digit mobile number";
  if (!isValidBangladeshPhone(normalized)) {
    return "Enter a valid Bangladeshi mobile number (01XXXXXXXXX)";
  }
  return null;
}
