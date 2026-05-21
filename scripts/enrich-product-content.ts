/**
 * npx tsx scripts/enrich-product-content.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  buildTripadProductData,
  defaultCategoryContent,
} from "../src/lib/product-catalog-content";
import { stringifyJsonField, parseGallery } from "../src/lib/product-data";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();

  for (const p of products) {
    const slug = p.slug.toLowerCase();
    const isTripad =
      slug.includes("tripad") ||
      p.name.toLowerCase().includes("tripad") ||
      p.category.toLowerCase().includes("mouse pad");

    let data: Record<string, unknown>;

    if (isTripad) {
      const variant =
        slug.includes("white") || p.name.toLowerCase().includes("white")
          ? "white"
          : "black";
      data = {
        ...buildTripadProductData(variant),
        price: p.price,
        stock: p.stock,
        compareAt: p.compareAt,
        colors: "[]",
      };
    } else {
      const extras = defaultCategoryContent(p.category, p.name);
      data = {
        ...extras,
        galleryImages:
          p.galleryImages === "[]"
            ? stringifyJsonField(parseGallery("", p.image))
            : p.galleryImages,
      };
    }

    await prisma.product.update({
      where: { id: p.id },
      data,
    });
    console.log(`Enriched: ${p.name}`);
  }

  console.log("All products updated.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
