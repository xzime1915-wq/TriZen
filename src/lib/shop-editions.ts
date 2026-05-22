export type ShopEdition = "v1" | "v2" | "other";

export function getShopEdition(slug: string, name: string): ShopEdition {
  const label = `${slug} ${name}`.toLowerCase();
  if (label.includes("v2") || label.includes("tripad-v2")) return "v2";
  if (label.includes("v1") || label.includes("tripad")) return "v1";
  return "other";
}

export const SHOP_EDITION_COPY: Record<
  ShopEdition,
  { eyebrow: string; title: string; intro: string[] }
> = {
  v1: {
    eyebrow: "In stock",
    title: "TriPad V1",
    intro: [
      "The original TriZen glass mouse pad — tempered glass tuned for competitive glide, a stable non-slip base, and two desk-ready finishes.",
      "V1 is built for ranked play, long sessions, and players who want predictable speed without sacrificing control. Choose black for a clean battlestation look or white for a minimal setup.",
      "Every V1 unit ships from TriZen Store across Bangladesh with Cash on Delivery, bKash, Nagad, or bank transfer.",
    ],
  },
  v2: {
    eyebrow: "Upcoming",
    title: "TriPad V2",
    intro: [
      "The next generation of TriPad keeps the same esports-grade glass surface you trust — with a refreshed vertical TriZen identity in black and white.",
      "V2 is designed for players who want bolder branding on the pad while keeping ultra-smooth, low-friction tracking for flicks and micro-adjustments.",
      "Launch dates will be announced here. Visit each edition below to see full details and register your interest before stock arrives.",
    ],
  },
  other: {
    eyebrow: "Collection",
    title: "More from TriZen",
    intro: [
      "Additional TriZen Store gear and accessories for your setup.",
    ],
  },
};

export const SHOP_EDITION_ORDER: ShopEdition[] = ["v1", "v2", "other"];
