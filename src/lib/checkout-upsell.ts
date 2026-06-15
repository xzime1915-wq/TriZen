import { prisma } from "@/lib/prisma";
import { parseColors, type ProductColor } from "@/lib/product-data";
import { isUpcoming, shouldShowProductPrice } from "@/lib/product-status";
import { getShopGearLine, type ShopGearLine } from "@/lib/shop-gears";

const COMPLEMENTARY: Record<ShopGearLine, ShopGearLine[]> = {
  "glass-mouse-pad": ["skates", "hand-sleeves", "soft-mouse-pad"],
  "soft-mouse-pad": ["skates", "hand-sleeves", "glass-mouse-pad"],
  skates: ["hand-sleeves", "glass-mouse-pad", "soft-mouse-pad"],
  "hand-sleeves": ["skates", "glass-mouse-pad", "soft-mouse-pad"],
};

export type CheckoutUpsellItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  image: string;
  stock: number;
  tag: string | null;
  colors: ProductColor[];
  headline: string;
};

function upsellHeadline(cartLines: Set<ShopGearLine>): string {
  if (cartLines.has("glass-mouse-pad")) {
    return "Level up your glass pad setup with TriZen skates or sleeves.";
  }
  if (cartLines.has("skates")) {
    return "Pair your skates with a glass pad or hand sleeve.";
  }
  if (cartLines.has("hand-sleeves")) {
    return "Complete your setup with skates or a glass mouse pad.";
  }
  return "Add more TriZen gear to your order.";
}

export async function getCheckoutUpsells(
  excludeIds: string[],
  limit = 2
): Promise<CheckoutUpsellItem[]> {
  const cartProducts =
    excludeIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: excludeIds } },
          select: { slug: true, name: true, category: true },
        })
      : [];

  const cartLines = new Set(
    cartProducts.map((p) => getShopGearLine(p.slug, p.name, p.category))
  );
  const preferred = [...cartLines].flatMap((line) => COMPLEMENTARY[line] ?? []);

  const candidates = await prisma.product.findMany({
    where: {
      id: { notIn: excludeIds },
      stock: { gt: 0 },
      price: { gt: 0 },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      compareAt: true,
      image: true,
      stock: true,
      tag: true,
      colors: true,
      category: true,
    },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  const headline = upsellHeadline(cartLines);

  const ranked = candidates
    .filter((p) => {
      if (isUpcoming(p.tag) || !shouldShowProductPrice(p.tag)) return false;
      const line = getShopGearLine(p.slug, p.name, p.category);
      return !cartLines.has(line);
    })
    .map((p) => {
      const line = getShopGearLine(p.slug, p.name, p.category);
      const idx = preferred.indexOf(line);
      return { p, rank: idx };
    })
    .filter(({ rank }) => rank !== -1)
    .sort((a, b) => a.rank - b.rank);

  const rankedIds = new Set(ranked.map(({ p }) => p.id));
  const fallback = candidates
    .filter((p) => {
      if (rankedIds.has(p.id)) return false;
      if (isUpcoming(p.tag) || !shouldShowProductPrice(p.tag)) return false;
      return true;
    })
    .map((p) => ({ p, rank: 999 }));

  let pool = [...ranked, ...fallback].slice(0, limit);

  if (pool.length === 0) {
    pool = candidates
      .filter((p) => !isUpcoming(p.tag) && shouldShowProductPrice(p.tag))
      .map((p) => ({ p, rank: 999 }))
      .slice(0, limit);
  }

  return pool.map(({ p }) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAt: p.compareAt,
    image: p.image,
    stock: p.stock,
    tag: p.tag,
    colors: parseColors(p.colors),
    headline,
  }));
}
