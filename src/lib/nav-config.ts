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
    href: "/shop?gear=glass-mouse-pad",
    label: "Mouse Pads",
    mega: "mouse-pads",
  },
  { href: "/track-order", label: "Track Order", drawer: "track-order" },
  { href: "/about", label: "Explore", mega: "explore" },
];

export const EXPLORE_LINKS = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

const GLASS_PAD_PRODUCT_LINKS = [
  { href: "/product/trizen-tripad-v1-black", label: "TP-V1 (black)" },
  { href: "/product/trizen-tripad-v1-white", label: "TP-V1 (white)" },
  { href: "/product/trizen-tripad-v2-black", label: "TP-V2 (black)" },
  { href: "/product/trizen-tripad-v2-white", label: "TP-V2 (white)" },
] as const;

export const MOUSE_PAD_MEGA_GROUPS = [
  {
    title: "Glass Pads",
    links: [...GLASS_PAD_PRODUCT_LINKS],
  },
  {
    title: "Soft Pads",
    links: [{ href: "/shop?gear=soft-mouse-pad", label: "Coming soon" }],
  },
] as const;

/** @deprecated use MOUSE_PAD_MEGA_GROUPS */
export const MOUSE_PAD_GROUPS = MOUSE_PAD_MEGA_GROUPS;

export const SHOP_MEGA_GROUPS = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Products" },
      { href: "/shop?gear=glass-mouse-pad", label: "Glass Pads" },
      { href: "/shop?gear=soft-mouse-pad", label: "New In" },
    ],
  },
  {
    title: "Glass Pads",
    links: [...GLASS_PAD_PRODUCT_LINKS],
  },
  {
    title: "Other Products",
    links: [
      { href: "/shop?gear=skates", label: "Mouse Skates" },
      { href: "/shop?gear=hand-sleeves", label: "Hand Sleeves" },
    ],
  },
] as const;

export type ShopMegaPromo = {
  href: string;
  image: string;
  fallbackImage?: string;
  eyebrow: string;
  description: string;
};

export const SHOP_MEGA_PROMOS: ShopMegaPromo[] = [
  {
    href: "/shop?gear=soft-mouse-pad",
    image: "/products/our-gears/soft-mouse-pad.png",
    fallbackImage: "/products/tripad-anti-slip-base.webp",
    eyebrow: "New In",
    description:
      "Fresh arrivals from our product team, straight off the line.",
  },
  {
    href: "/#sandbox",
    image: "/products/our-gears/hand-sleeves.png",
    fallbackImage: "/products/engineered-glide.webp",
    eyebrow: "Upcoming",
    description:
      "Join Sandbox for launch alerts and first-order offers.",
  },
];

export const MOUSE_PAD_MEGA_PROMOS: ShopMegaPromo[] = [
  {
    href: "/shop?gear=glass-mouse-pad",
    image: "/products/tripad-v1-black.webp",
    fallbackImage: "/products/tripad-v1-black.png",
    eyebrow: "Glass Pads",
    description:
      "Ultra smooth tempered glass tuned for competitive glide and precise tracking.",
  },
  {
    href: "/shop?gear=glass-mouse-pad",
    image: "/products/tripad-v2-black.webp",
    fallbackImage: "/products/tripad-v2-black.png",
    eyebrow: "TRIPAD Editions",
    description:
      "V1 and V2 glass pads built for a complete desk upgrade.",
  },
  {
    href: "/shop?gear=soft-mouse-pad",
    image: "/products/our-gears/soft-mouse-pad.png",
    fallbackImage: "/products/tripad-anti-slip-base.webp",
    eyebrow: "Soft Pads",
    description:
      "Cloth feel with precise control. Coming soon to the shop.",
  },
];

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
  { href: "/product/trizen-tripad-v1-black", label: "TP-V1 (black)" },
  { href: "/product/trizen-tripad-v1-white", label: "TP-V1 (white)" },
  { href: "/shop?gear=glass-mouse-pad", label: "Glass Mouse Pad" },
  { href: "/shop?gear=skates", label: "Mouse Skates" },
  { href: "/shop?gear=hand-sleeves", label: "Hand Sleeves" },
  { href: "/shop", label: "All Products" },
  { href: "/about", label: "About TRIZEN" },
] as const;
