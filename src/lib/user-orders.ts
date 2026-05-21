import { prisma } from "./prisma";

/** Attach past guest orders (same email) to the logged-in account */
export async function linkOrdersToUser(userId: string, email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;

  await prisma.order.updateMany({
    where: { customerEmail: normalized, userId: null },
    data: { userId },
  });
}

export async function getOrdersForUser(userId: string, email: string) {
  await linkOrdersToUser(userId, email);

  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
