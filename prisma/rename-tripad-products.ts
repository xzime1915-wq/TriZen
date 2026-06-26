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
  const runId = Date.now();

  for (const [index, data] of updates.entries()) {
    await prisma.product.update({
      where: { slug: data.slug },
      data: {
        sku: `TEMP-SKU-${runId}-${index}`,
        barcode: `TEMP-BARCODE-${runId}-${index}`,
      },
    });
  }

  for (const data of updates) {
    await prisma.product.update({
      where: { slug: data.slug },
      data: {
        name: data.name,
        sku: data.sku,
        barcode: data.barcode,
        description: data.description,
        longDescription: data.longDescription,
        features: data.features,
        specifications: data.specifications,
      },
    });
    console.log(`Synced: ${data.slug} -> ${data.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
