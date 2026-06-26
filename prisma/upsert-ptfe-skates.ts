import { PrismaClient } from "@prisma/client";
import { buildPtfeMouseSkatesProductData } from "../src/lib/product-catalog-content";

const prisma = new PrismaClient();

async function main() {
  const data = buildPtfeMouseSkatesProductData();

  await prisma.product.upsert({
    where: { slug: data.slug },
    create: {
      ...data,
      price: 0,
      compareAt: null,
      stock: 0,
    },
    update: {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      features: data.features,
      specifications: data.specifications,
      galleryImages: data.galleryImages,
      colors: data.colors,
      sku: data.sku,
      barcode: data.barcode,
      tag: data.tag,
      image: data.image,
      category: data.category,
      featured: data.featured,
    },
  });

  console.log(`Upserted: ${data.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
