import { SHOP_GEAR_COPY, SHOP_GEAR_ORDER } from "@/lib/shop-gears";

export type HeaderMegaKey = "shop" | "mouse-pads" | "explore";

export type HeaderNavItem = {
  href: string;
  label: string;
  mega?: HeaderMegaKey;
  drawer?: "track-order";
};

export const HEADER_NAV: HeaderNavItem[] = [
  { href: "/shop", label: "Shop", mega: "shop" },
  {
    href: "/shop#gear-glass-mouse-pad",
    label: "Mouse Pads",
    mega: "mouse-pads",
  },
  { href: "/shop?gear=skates", label: "Skates" },
  { href: "/shop?gear=hand-sleeves", label: "Sleeves" },
  { href: "/track-order", label: "Track Order", drawer: "track-order" },
  { href: "/about", label: "Explore", mega: "explore" },
];

export const EXPLORE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const MOUSE_PAD_GROUPS = [
  {
    title: "Glass Pads",
    links: [{ href: "/shop?gear=glass-mouse-pad", label: "TP-V1" }],
  },
  {
    title: "Soft Pads",
    links: [{ href: "/shop?gear=soft-mouse-pad", label: "Soft Mouse Pad" }],
  },
] as const;

export const SHOP_MEGA_GROUPS = [
  {
    title: "All Products",
    links: [{ href: "/shop", label: "Shop All" }],
  },
  {
    title: "Mouse Pads",
    links: [
      { href: "/shop?gear=glass-mouse-pad", label: "Glass Mouse Pad" },
      { href: "/shop?gear=soft-mouse-pad", label: "Soft Mouse Pad" },
    ],
  },
  {
    title: "More Gear",
    links: [
      { href: "/shop?gear=skates", label: "Skates" },
      { href: "/shop?gear=hand-sleeves", label: "Hand Sleeves" },
    ],
  },
] as const;

const MOUSE_PAD_GEARS = ["glass-mouse-pad", "soft-mouse-pad"] as const;

function gearMegaCard(gear: (typeof MOUSE_PAD_GEARS)[number] | "skates" | "hand-sleeves") {
  const copy = SHOP_GEAR_COPY[gear];
  return {
    gear,
    href: `/shop?gear=${gear}`,
    title: copy.title,
    description:
      gear === "glass-mouse-pad"
        ? "Maximum glide for competitive play."
        : gear === "soft-mouse-pad"
          ? "Soft touch with precise control."
          : gear === "skates"
            ? "Low friction, max performance."
            : "Less friction, more focus.",
    status: copy.statusLabel,
  };
}

export const MOUSE_PAD_MEGA_CARDS = MOUSE_PAD_GEARS.map(gearMegaCard);

export const SHOP_MEGA_CARDS = SHOP_GEAR_ORDER.map((gear) => gearMegaCard(gear));

export const MEGA_MENU_CARDS = SHOP_MEGA_CARDS;
export const SEARCH_SUGGESTIONS = [
  { href: "/shop?gear=glass-mouse-pad", label: "Glass Mouse Pad" },
  { href: "/shop?gear=soft-mouse-pad", label: "Soft Mouse Pad" },
  { href: "/shop?gear=skates", label: "Mouse Skates" },
  { href: "/shop?gear=hand-sleeves", label: "Hand Sleeves" },
  { href: "/shop", label: "All Products" },
  { href: "/about", label: "About TRIZEN" },
] as const;
