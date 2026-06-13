import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { slug: true, name: true } },
          review: { select: { id: true } },
        },
      },
    },
  });

  const reviews = await prisma.productReview.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, verified: true, authorName: true, authorEmail: true },
  });

  const products = await prisma.product.findMany({
    take: 5,
    select: { slug: true, name: true },
  });

  console.log("=== ORDERS ===");
  for (const order of orders) {
    console.log(
      `${order.orderNumber} | ${order.status} | ${order.customerEmail} | items: ${order.items
        .map((item) => `${item.product.slug}${item.review ? " (reviewed)" : ""}`)
        .join(", ")}`
    );
  }

  console.log("\n=== REVIEWS ===");
  if (reviews.length === 0) console.log("(none)");
  for (const review of reviews) {
    console.log(`${review.authorName} | verified=${review.verified} | ${review.authorEmail}`);
  }

  console.log("\n=== PRODUCTS ===");
  for (const product of products) {
    console.log(`${product.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
