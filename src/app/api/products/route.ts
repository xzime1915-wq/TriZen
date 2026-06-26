import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { description: { contains: q } },
              { category: { contains: q } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      longDescription: true,
      features: true,
      specifications: true,
      galleryImages: true,
      colors: true,
      sku: true,
      tag: true,
      price: true,
      compareAt: true,
      image: true,
      category: true,
      stock: true,
      featured: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
