import { prisma } from "@/lib/prisma";

export const REVIEW_ELIGIBLE_ORDER_STATUSES = ["delivered"] as const;

export const verifiedReviewWhere = { verified: true } as const;

export const verifiedReviewSelect = {
  id: true,
  authorName: true,
  rating: true,
  title: true,
  body: true,
  verified: true,
  createdAt: true,
} as const;

export type ReviewEligibility = {
  eligible: boolean;
  orderId?: string;
  orderItemId?: string;
  reason?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getVerifiedReviewStats() {
  return prisma.productReview.aggregate({
    where: verifiedReviewWhere,
    _count: true,
    _avg: { rating: true },
  });
}

export async function findReviewEligibility({
  productId,
  userId,
  email,
}: {
  productId: string;
  userId?: string | null;
  email?: string | null;
}): Promise<ReviewEligibility> {
  const normalizedEmail = email ? normalizeEmail(email) : null;

  if (!userId && !normalizedEmail) {
    return {
      eligible: false,
      reason: "Sign in or use your order email to leave a verified review.",
    };
  }

  const identityFilter = [
    ...(userId ? [{ userId }] : []),
    ...(normalizedEmail ? [{ customerEmail: normalizedEmail }] : []),
  ];

  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...REVIEW_ELIGIBLE_ORDER_STATUSES] },
      OR: identityFilter,
      items: { some: { productId } },
    },
    include: {
      items: {
        where: { productId },
      },
    },
    orderBy: { deliveredAt: "desc" },
  });

  const reviewedOrderItemIds = await prisma.productReview.findMany({
    where: {
      productId,
      orderItemId: { not: null },
      OR: [
        ...(userId ? [{ userId }] : []),
        ...(normalizedEmail ? [{ authorEmail: normalizedEmail }] : []),
      ],
    },
    select: { orderItemId: true },
  });
  const reviewedSet = new Set(
    reviewedOrderItemIds.map((review) => review.orderItemId).filter(Boolean)
  );

  for (const order of orders) {
    for (const item of order.items) {
      if (!reviewedSet.has(item.id)) {
        return {
          eligible: true,
          orderId: order.id,
          orderItemId: item.id,
        };
      }
    }
  }

  const pendingOrder = await prisma.order.findFirst({
    where: {
      status: { notIn: ["cancelled", "delivered"] },
      OR: identityFilter,
      items: { some: { productId } },
    },
  });

  if (pendingOrder) {
    return {
      eligible: false,
      reason: "Your order must be delivered before you can leave a review.",
    };
  }

  const purchasedOrder = await prisma.order.findFirst({
    where: {
      OR: identityFilter,
      items: { some: { productId } },
    },
  });

  if (purchasedOrder) {
    return {
      eligible: false,
      reason: "You have already reviewed this purchase.",
    };
  }

  return {
    eligible: false,
    reason:
      "Only customers who purchased and received this product can leave a review.",
  };
}

export async function assertReviewPurchase({
  productId,
  orderId,
  orderItemId,
  userId,
  email,
}: {
  productId: string;
  orderId: string;
  orderItemId: string;
  userId?: string | null;
  email: string;
}) {
  const normalizedEmail = normalizeEmail(email);
  const identityFilter = [
    ...(userId ? [{ userId }] : []),
    { customerEmail: normalizedEmail },
  ];

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      id: orderItemId,
      orderId,
      productId,
      order: {
        status: { in: [...REVIEW_ELIGIBLE_ORDER_STATUSES] },
        OR: identityFilter,
      },
      review: null,
    },
    select: {
      id: true,
      orderId: true,
    },
  });

  if (!orderItem) {
    return null;
  }

  return orderItem;
}
