import type { OrderItemInput } from "./orders";

export type CreateOrderPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country?: string;
  notes?: string | null;
  paymentMethod?: string;
  paymentRef?: string | null;
  items: OrderItemInput[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseCreateOrderPayload(body: unknown): CreateOrderPayload | string {
  if (!body || typeof body !== "object") return "Invalid request body";

  const b = body as Record<string, unknown>;
  const customerName = String(b.customerName ?? "").trim();
  const customerEmail = String(b.customerEmail ?? "").trim().toLowerCase();
  const customerPhone = String(b.customerPhone ?? "").trim();
  const shippingAddress = String(b.shippingAddress ?? "").trim();
  const city = String(b.city ?? "").trim();

  if (customerName.length < 2) return "Full name is required";
  if (!EMAIL_RE.test(customerEmail)) return "Valid email is required";
  if (customerPhone.length < 10) return "Valid phone number is required";
  if (shippingAddress.length < 5) return "Shipping address is required";
  if (city.length < 2) return "City / district is required";

  if (!Array.isArray(b.items) || b.items.length === 0) return "Cart is empty";
  if (b.items.length > 20) return "Too many items in one order";

  const items: OrderItemInput[] = [];
  for (const raw of b.items) {
    if (!raw || typeof raw !== "object") return "Invalid cart item";
    const item = raw as Record<string, unknown>;
    const productId = String(item.productId ?? "").trim();
    const quantity = Number(item.quantity);
    if (!productId) return "Invalid product in cart";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return "Invalid quantity";
    }
    items.push({ productId, quantity });
  }

  const paymentMethod =
    typeof b.paymentMethod === "string" ? b.paymentMethod : "cod";
  if (paymentMethod !== "cod" && paymentMethod !== "bkash") {
    return "Invalid payment method";
  }

  return {
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    city,
    country: typeof b.country === "string" ? b.country.trim() : "Bangladesh",
    notes: typeof b.notes === "string" ? b.notes.trim() : null,
    paymentMethod,
    paymentRef: typeof b.paymentRef === "string" ? b.paymentRef.trim() : null,
    items,
  };
}
