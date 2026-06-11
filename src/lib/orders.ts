import { prisma } from "./prisma";
import { normalizePhone, upsertCustomerFromOrder } from "./customers";
import { isUpcoming } from "./product-status";
import { notifyAdminNewOrder } from "./admin-notify";
import {
  DELIVERY_CHARGE,
  generateInvoiceNumber,
  generateOrderNumber,
} from "./utils";

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export async function buildOrderItems(items: OrderItemInput[]) {
  let subtotal = 0;
  const orderItems: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (isUpcoming(product.tag) || product.stock < 1) {
      throw new Error(`${product.name} is not available for purchase yet`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
    subtotal += product.price * item.quantity;
  }

  return { subtotal, orderItems };
}

export async function createOrder(data: {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  country?: string;
  notes?: string | null;
  adminNotes?: string | null;
  paymentMethod?: string;
  paymentRef?: string | null;
  status?: string;
  shippingCost?: number;
  items: OrderItemInput[];
  decrementStock?: boolean;
  notifyAdmin?: boolean;
}) {
  const { subtotal, orderItems } = await buildOrderItems(data.items);
  const shippingCost = data.shippingCost ?? DELIVERY_CHARGE;
  const total = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();
  const invoiceNumber = generateInvoiceNumber(orderNumber);

  const customer = await upsertCustomerFromOrder({
    name: data.customerName,
    email: data.customerEmail,
    phone: data.customerPhone,
    shippingAddress: data.shippingAddress,
    city: data.city,
    country: data.country,
  });

  return prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        invoiceNumber,
        status: data.status || "pending_payment",
        paymentMethod: data.paymentMethod || "cod",
        paymentRef: data.paymentRef || null,
        customerId: customer?.id,
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail.trim().toLowerCase(),
        customerPhone: normalizePhone(data.customerPhone),
        shippingAddress: data.shippingAddress,
        city: data.city,
        state: "",
        zipCode: "",
        country: data.country || "Bangladesh",
        subtotal,
        shippingCost,
        tax: 0,
        total,
        notes: data.notes || null,
        adminNotes: data.adminNotes || null,
        items: { create: orderItems },
      },
      include: { items: true, customer: true },
    });

    if (data.decrementStock !== false) {
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    if (data.notifyAdmin !== false) {
      notifyAdminNewOrder({
        id: created.id,
        orderNumber: created.orderNumber,
        customerName: created.customerName,
        customerPhone: created.customerPhone,
        total: created.total,
        paymentMethod: created.paymentMethod,
      });
    }

    return created;
  });
}

export async function restoreOrderStock(orderId: string) {
  const items = await prisma.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}
