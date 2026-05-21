import { PrismaClient } from "@prisma/client";
import { buildTripadV2ProductData } from "../src/lib/product-catalog-content";

const prisma = new PrismaClient();

const v2Products = [
  { ...buildTripadV2ProductData("black"), price: 0, compareAt: null, stock: 0 },
  { ...buildTripadV2ProductData("white"), price: 0, compareAt: null, stock: 0 },
];

async function main() {
  for (const data of v2Products) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      create: data,
      update: {
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        features: data.features,
        specifications: data.specifications,
        galleryImages: data.galleryImages,
        colors: data.colors,
        sku: data.sku,
        tag: "Upcoming",
        image: data.image,
        category: data.category,
        featured: data.featured,
        price: 0,
        compareAt: null,
        stock: 0,
      },
    });
    console.log(`Upserted: ${data.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
