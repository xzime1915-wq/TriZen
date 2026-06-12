/**
 * Run once to add features/colors/specs to existing products without wiping orders:
 * npx tsx scripts/backfill-product-details.ts
 */
import { PrismaClient } from "@prisma/client";
import { stringifyJsonField } from "../src/lib/product-data";

const prisma = new PrismaClient();

const defaults = {
  features: stringifyJsonField([
    "Premium TRIZEN quality",
    "Designed for esports performance",
  ]),
  specifications: stringifyJsonField([
    { label: "Brand", value: "TRIZEN" },
  ]),
};

async function main() {
  const products = await prisma.product.findMany();

  for (const p of products) {
    const gallery =
      p.galleryImages === "[]"
        ? stringifyJsonField([p.image])
        : p.galleryImages;
    const colors =
      p.colors === "[]"
        ? stringifyJsonField([{ name: "Default", image: p.image }])
        : p.colors;

    await prisma.product.update({
      where: { id: p.id },
      data: {
        longDescription: p.longDescription || p.description,
        features: p.features === "[]" ? defaults.features : p.features,
        specifications:
          p.specifications === "[]" ? defaults.specifications : p.specifications,
        galleryImages: gallery,
        colors,
      },
    });
    console.log(`Updated: ${p.name}`);
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
