import type { Metadata } from "next";
import {
  SEO_ESPORTS_MOUSE_PAD_BD,
  SEO_GLASS_MOUSE_PAD_BD,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site-config";

export function glassMousePadShopMetadata(): Metadata {
  const path = "/shop?gear=glass-mouse-pad";
  return {
    title: "Large Glass Mouse Pad in Bangladesh",
    description:
      "Large glass mouse pad in Bangladesh, TRIZEN TRIPAD tempered glass surface with low friction glide for competitive FPS and ranked play.",
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Large Glass Mouse Pad in Bangladesh | ${SITE_NAME}`,
      description:
        "TRIZEN TRIPAD, premium large esports glass mouse pads in Bangladesh with low friction competitive glide.",
      url: `${SITE_URL}${path}`,
    },
  };
}

export function esportsMousePadShopMetadata(): Metadata {
  const path = "/shop";
  return {
    title: "Esports Mouse Pad in Bangladesh",
    description:
      "Shop esports mouse pads in Bangladesh at TRIZEN, including large glass TRIPAD pads, soft pads, mouse skates and hand sleeves for competitive play.",
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Esports Mouse Pad in Bangladesh | ${SITE_NAME}`,
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
      "Esports mouse pads in Bangladesh from TRIZEN Store. Explore TRIPAD glass pads, soft pads, mouse skates and hand sleeves for competitive play.",
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: SITE_TITLE,
      url: SITE_URL,
    },
  };
}
