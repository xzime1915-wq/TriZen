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
    statusLabel: string;
  }
> = {
  "glass-mouse-pad": {
    eyebrow: "In stock",
    title: "Glass Mouse Pad",
    statusLabel: "Grab Now",
  },
  "soft-mouse-pad": {
    eyebrow: "Upcoming",
    title: "Soft Mouse Pad",
    titleLine2: "",
    statusLabel: "Upcoming",
  },
  skates: {
    eyebrow: "Lineup",
    title: "Skates",
    statusLabel: "Grab Now",
  },
  "hand-sleeves": {
    eyebrow: "Upcoming",
    title: "Hand Sleeves",
    statusLabel: "Upcoming",
  },
};

export function isShopGearLine(value: string | undefined): value is ShopGearLine {
  return SHOP_GEAR_ORDER.includes(value as ShopGearLine);
}
