import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  syncCustomersFromOrders,
  enrichCustomerWithOrders,
  normalizePhone,
} from "@/lib/customers";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    const customers = await prisma.customer.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    const enriched = await Promise.all(customers.map(enrichCustomerWithOrders));
    return NextResponse.json(enriched);
  }

  const normalizedQ = normalizePhone(q);
  const searchPhone = normalizedQ.length >= 3 ? normalizedQ : q;

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { phone: { contains: searchPhone } },
        { name: { contains: q } },
        { email: { contains: q } },
      ],
    },
    orderBy: { updatedAt: "desc" },
  });

  const enriched = await Promise.all(customers.map(enrichCustomerWithOrders));

  if (enriched.length === 0 && searchPhone.length >= 3) {
    const { getOrdersForCustomer } = await import("@/lib/customers");
    const ordersOnly = await prisma.order.findMany({
      where: { customerPhone: { contains: searchPhone } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const match = ordersOnly.find(
      (o) => normalizePhone(o.customerPhone) === searchPhone
    );
    if (match) {
      const phone = normalizePhone(match.customerPhone);
      const orders = await getOrdersForCustomer("", phone);
      return NextResponse.json([
        {
          id: "unlinked",
          name: match.customerName,
          email: match.customerEmail,
          phone,
          shippingAddress: match.shippingAddress,
          city: match.city,
          country: match.country,
          orders,
          _count: { orders: orders.length },
        },
      ]);
    }
  }

  return NextResponse.json(enriched);
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await syncCustomersFromOrders();
  return NextResponse.json({ synced: count });
}
