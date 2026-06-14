import { PrismaClient } from "@prisma/client";
import {
  buildTripadProductData,
  buildTripadV2ProductData,
} from "../src/lib/product-catalog-content";

const prisma = new PrismaClient();

const updates = [
  buildTripadProductData("black"),
  buildTripadProductData("white"),
  buildTripadV2ProductData("black"),
  buildTripadV2ProductData("white"),
];

async function main() {
  for (const data of updates) {
    await prisma.product.update({
      where: { slug: data.slug },
      data: {
        name: data.name,
        specifications: data.specifications,
      },
    });
    console.log(`Renamed: ${data.slug} -> ${data.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
