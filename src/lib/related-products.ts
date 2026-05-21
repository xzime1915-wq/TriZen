import { prisma } from "./prisma";

const LIMIT = 4;

export async function getRelatedProducts(productId: string, category: string) {
  const sameCategory = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category,
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    take: LIMIT,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAt: true,
      image: true,
      category: true,
      stock: true,
      tag: true,
    },
  });

  if (sameCategory.length >= LIMIT) return sameCategory;

  const excludeIds = [productId, ...sameCategory.map((p) => p.id)];
  const others = await prisma.product.findMany({
    where: { id: { notIn: excludeIds } },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
    take: LIMIT - sameCategory.length,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAt: true,
      image: true,
      category: true,
      stock: true,
      tag: true,
    },
  });

  return [...sameCategory, ...others];
}
