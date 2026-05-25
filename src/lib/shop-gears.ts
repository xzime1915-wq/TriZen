export type ShopGearLine =
  | "glass-mouse-pad"
  | "soft-mouse-pad"
  | "skates"
  | "hand-sleeves";

export function getShopGearLine(
  slug: string,
  name: string,
  category?: string
): ShopGearLine {
  const label = `${slug} ${name} ${category ?? ""}`.toLowerCase();

  if (label.includes("sleeve")) return "hand-sleeves";
  if (label.includes("skate")) return "skates";
  if (label.includes("soft") && (label.includes("pad") || label.includes("mouse"))) {
    return "soft-mouse-pad";
  }
  if (
    label.includes("tripad") ||
    label.includes("tri pad") ||
    label.includes("glass")
  ) {
    return "glass-mouse-pad";
  }

  const cat = (category ?? "").toLowerCase();
  if (cat.includes("sleeve")) return "hand-sleeves";
  if (cat.includes("skate")) return "skates";
  if (cat.includes("soft")) return "soft-mouse-pad";
  if (cat.includes("mouse pad") || cat.includes("mousepad")) return "glass-mouse-pad";

  return "glass-mouse-pad";
}

export const SHOP_GEAR_ORDER: ShopGearLine[] = [
  "glass-mouse-pad",
  "soft-mouse-pad",
  "skates",
  "hand-sleeves",
];

export const SHOP_GEAR_COPY: Record<
  ShopGearLine,
  {
    eyebrow: string;
    title: string;
    titleLine2?: string;
    intro: string[];
    statusLabel: string;
  }
> = {
  "glass-mouse-pad": {
    eyebrow: "In stock",
    title: "Glass Mouse Pad",
    intro: [
      "TriPad tempered glass — ultra-smooth glide, stable base, and black or white editions built for ranked play.",
      "V1 ships now across Bangladesh. V2 editions are coming soon with refreshed vertical TriZen branding.",
    ],
    statusLabel: "Grab Now",
  },
  "soft-mouse-pad": {
    eyebrow: "Upcoming",
    title: "Soft Mouse Pad",
    titleLine2: "",
    intro: [
      "A softer surface line for players who want cushioned control without giving up precision.",
      "Launching soon at TriZen Store — check back for dates and editions.",
    ],
    statusLabel: "Upcoming",
  },
  skates: {
    eyebrow: "Lineup",
    title: "Skates",
    intro: [
      "Low-friction mouse feet tuned for consistent glide on glass and hard pads.",
      "Browse compatible sets for your mouse when stock is live.",
    ],
    statusLabel: "Grab Now",
  },
  "hand-sleeves": {
    eyebrow: "Upcoming",
    title: "Hand Sleeves",
    intro: [
      "Compression sleeves that cut sleeve drag and keep your aim steady through long sessions.",
      "Coming soon to TriZen Store.",
    ],
    statusLabel: "Upcoming",
  },
};

export function isShopGearLine(value: string | undefined): value is ShopGearLine {
  return SHOP_GEAR_ORDER.includes(value as ShopGearLine);
}
