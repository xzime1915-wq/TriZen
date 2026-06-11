import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseColors } from "@/lib/product-data";
import {
  baseNameFromProductName,
  editionLabelFromName,
} from "@/lib/product-edition";
import { isUpcoming, shouldShowProductPrice } from "@/lib/product-status";
import { getShopGearLine } from "@/lib/shop-gears";

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ editions: [] });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, slug: true, category: true },
    });

    if (!product) {
      return NextResponse.json({ editions: [] });
    }

    const gearLine = getShopGearLine(product.slug, product.name, product.category);
    const candidates = await prisma.product.findMany({
      where: { stock: { gt: 0 }, price: { gt: 0 } },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        price: true,
        compareAt: true,
        image: true,
        stock: true,
        tag: true,
        colors: true,
      },
      orderBy: { name: "asc" },
    });

    const editions = candidates
      .filter((p) => {
        if (isUpcoming(p.tag) || !shouldShowProductPrice(p.tag)) return false;
        return getShopGearLine(p.slug, p.name, p.category) === gearLine;
      })
      .map((p) => ({
        productId: p.id,
        label: editionLabelFromName(p.name),
        name: p.name,
        baseName: baseNameFromProductName(p.name),
        price: p.price,
        compareAt: p.compareAt,
        image: p.image,
        stock: p.stock,
        colors: parseColors(p.colors),
      }));

    return NextResponse.json({ editions });
  } catch {
    return NextResponse.json({ editions: [] }, { status: 500 });
  }
}
