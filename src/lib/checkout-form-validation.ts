import type { BillingFormState } from "@/components/checkout/CheckoutBillingForm";
import { bangladeshPhoneError } from "@/lib/phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckoutFieldKey =
  | "customerEmail"
  | "customerPhone"
  | "fullName"
  | "streetAddress";

export type CheckoutFieldErrors = Partial<Record<CheckoutFieldKey, string>>;

export function validateCheckoutForm(form: BillingFormState): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};

  if (!form.customerEmail.trim()) {
    errors.customerEmail = "Email is required";
  } else if (!EMAIL_RE.test(form.customerEmail.trim())) {
    errors.customerEmail = "Enter a valid email";
  }

  const phoneError = bangladeshPhoneError(form.customerPhone);
  if (phoneError) errors.customerPhone = phoneError;

  if (!form.fullName.trim()) {
    errors.fullName = "Name is required";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name";
  }

  if (!form.streetAddress.trim()) {
    errors.streetAddress = "Address is required";
  } else if (form.streetAddress.trim().length < 5) {
    errors.streetAddress = "Enter your full address";
  }

  return errors;
}
