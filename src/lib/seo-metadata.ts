import type { Metadata } from "next";
import type { ShopGearLine } from "@/lib/shop-gears";
import {
  SEO_ESPORTS_MOUSE_PAD_BD,
  SEO_GLASS_MOUSE_PAD_BD,
  SEO_MOUSE_PAD_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-config";

const GEAR_METADATA: Record<
  ShopGearLine,
  {
    path: string;
    title: string;
    description: string;
    ogTitle: string;
    keywords: string[];
  }
> = {
  "glass-mouse-pad": {
    path: "/shop?gear=glass-mouse-pad",
    title: "Glass Mouse Pad Price in Bangladesh",
    description:
      "Buy TRIZEN TRIPAD glass mouse pads in Bangladesh. Large tempered glass gaming mouse pads with fast glide for FPS, Valorant, CS2 and ranked play.",
    ogTitle: `Glass Mouse Pad Price in Bangladesh | ${SITE_NAME}`,
    keywords: [
      SEO_GLASS_MOUSE_PAD_BD,
      "glass mouse pad price in Bangladesh",
      "glass gaming mouse pad BD",
      "TRIPAD glass mouse pad Bangladesh",
      "large glass mouse pad",
    ],
  },
  "soft-mouse-pad": {
    path: "/shop?gear=soft-mouse-pad",
    title: "Soft Gaming Mouse Pad in Bangladesh",
    description:
      "Shop TRIZEN soft gaming mouse pads in Bangladesh for balanced control, comfort and competitive desk setups. New esports gear launches at TRIZEN Store.",
    ogTitle: `Soft Gaming Mouse Pad in Bangladesh | ${SITE_NAME}`,
    keywords: [
      "soft gaming mouse pad Bangladesh",
      "cloth mouse pad Bangladesh",
      "control mouse pad BD",
    ],
  },
  skates: {
    path: "/shop?gear=skates",
    title: "Mouse Skates in Bangladesh",
    description:
      "Shop TRIZEN mouse skates in Bangladesh for smoother, lower-friction mouse glide on gaming mice. Order esports gear from TRIZEN Store.",
    ogTitle: `Mouse Skates in Bangladesh | ${SITE_NAME}`,
    keywords: [
      "mouse skates Bangladesh",
      "mouse feet Bangladesh",
      "PTFE mouse skates BD",
    ],
  },
  "hand-sleeves": {
    path: "/shop?gear=hand-sleeves",
    title: "Gaming Hand Sleeve in Bangladesh",
    description:
      "Explore TRIZEN gaming hand sleeves in Bangladesh for smoother arm movement, less desk friction and longer FPS or ranked sessions.",
    ogTitle: `Gaming Hand Sleeve in Bangladesh | ${SITE_NAME}`,
    keywords: [
      "gaming hand sleeve Bangladesh",
      "esports sleeve Bangladesh",
      "mouse arm sleeve BD",
    ],
  },
};

function withDefaultKeywords(keywords: string[] = []) {
  return Array.from(new Set([...keywords, ...SEO_MOUSE_PAD_KEYWORDS]));
}

export function shopGearMetadata(gear: ShopGearLine): Metadata {
  const meta = GEAR_METADATA[gear];

  return {
    title: meta.title,
    description: meta.description,
    keywords: withDefaultKeywords(meta.keywords),
    alternates: { canonical: `${SITE_URL}${meta.path}` },
    openGraph: {
      title: meta.ogTitle,
      description: meta.description,
      url: `${SITE_URL}${meta.path}`,
    },
  };
}

export function glassMousePadShopMetadata(): Metadata {
  return shopGearMetadata("glass-mouse-pad");
}

export function esportsMousePadShopMetadata(): Metadata {
  const path = "/shop";
  return {
    title: "Gaming Mouse Pad Price in Bangladesh",
    description:
      "Shop gaming mouse pads in Bangladesh at TRIZEN: TRIPAD glass pads, large mouse pads, mouse skates and hand sleeves with COD and nationwide delivery.",
    keywords: withDefaultKeywords([SEO_ESPORTS_MOUSE_PAD_BD]),
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Gaming Mouse Pad Price in Bangladesh | ${SITE_NAME}`,
      description:
        "TRIZEN Store, esports mouse pads and gaming desk gear shipped across Bangladesh.",
      url: `${SITE_URL}${path}`,
    },
  };
}

export function homePageMetadata(): Metadata {
  return {
    title: SITE_TITLE,
    description:
      "Buy esports and gaming mouse pads in Bangladesh from TRIZEN Store. Shop TRIPAD glass pads, large mouse pads, skates, sleeves and COD delivery.",
    keywords: withDefaultKeywords([SEO_GLASS_MOUSE_PAD_BD, SEO_ESPORTS_MOUSE_PAD_BD]),
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: SITE_TITLE,
      url: SITE_URL,
    },
  };
}
