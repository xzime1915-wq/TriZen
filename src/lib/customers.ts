import { prisma } from "./prisma";

/** Canonical BD phone for matching (e.g. 01860841739) */
export function normalizePhone(phone: string) {
  let p = phone.replace(/[\s\-+]/g, "").trim();
  if (p.startsWith("880")) p = "0" + p.slice(3);
  if (p.length === 10 && !p.startsWith("0")) p = "0" + p;
  return p;
}

/** Link every order with this phone to the customer profile */
export async function linkOrdersToCustomer(customerId: string, phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) return;

  await prisma.order.updateMany({
    where: { customerPhone: normalized },
    data: { customerId },
  });

  const unlinked = await prisma.order.findMany({
    where: { OR: [{ customerId: null }, { customerId: { not: customerId } }] },
    select: { id: true, customerPhone: true },
  });

  for (const o of unlinked) {
    if (normalizePhone(o.customerPhone) === normalized) {
      await prisma.order.update({
        where: { id: o.id },
        data: { customerId, customerPhone: normalized },
      });
    }
  }
}

export async function getOrdersForCustomer(customerId: string, phone: string) {
  const normalized = normalizePhone(phone);

  const linked = customerId
    ? await prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })
    : [];

  const byPhone = await prisma.order.findMany({
    where: customerId
      ? { customerPhone: normalized, customerId: { not: customerId } }
      : { customerPhone: normalized },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const seen = new Set<string>();
  const merged = [...linked, ...byPhone].filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });

  if (merged.length > 0) return merged;

  const legacy = await prisma.order.findMany({
    where: { customerId: null },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return legacy.filter((o) => normalizePhone(o.customerPhone) === normalized);
}

export async function upsertCustomerFromOrder(data: {
  name: string;
  email: string;
  phone: string;
  shippingAddress?: string;
  city?: string;
  country?: string;
}) {
  const phone = normalizePhone(data.phone);
  if (!phone) return null;

  const customer = await prisma.customer.upsert({
    where: { phone },
    update: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      shippingAddress: data.shippingAddress?.trim() || undefined,
      city: data.city?.trim() || undefined,
      country: data.country?.trim() || "Bangladesh",
      updatedAt: new Date(),
    },
    create: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone,
      shippingAddress: data.shippingAddress?.trim() || null,
      city: data.city?.trim() || null,
      country: data.country?.trim() || "Bangladesh",
    },
  });

  await linkOrdersToCustomer(customer.id, phone);
  return customer;
}

/** Backfill Customer records and link all order history */
export async function syncCustomersFromOrders() {
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      shippingAddress: true,
      city: true,
      country: true,
    },
  });

  for (const o of orders) {
    const phone = normalizePhone(o.customerPhone);
    if (!phone) continue;

    if (o.customerPhone !== phone) {
      await prisma.order.update({
        where: { id: o.id },
        data: { customerPhone: phone },
      });
    }

    await upsertCustomerFromOrder({
      name: o.customerName,
      email: o.customerEmail,
      phone,
      shippingAddress: o.shippingAddress,
      city: o.city,
      country: o.country,
    });
  }

  return prisma.customer.count();
}

export async function enrichCustomerWithOrders<
  T extends { id: string; phone: string },
>(customer: T) {
  const orders = await getOrdersForCustomer(customer.id, customer.phone);
  return {
    ...customer,
    orders,
    _count: { orders: orders.length },
  };
}
