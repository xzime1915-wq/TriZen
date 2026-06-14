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
    title: "Glass Mouse Pad in Bangladesh",
    description:
      "Esports glass mouse pad in Bangladesh, TRIZEN TRIPAD tempered glass, low friction glide. COD, bKash, Nagad & nationwide delivery.",
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Glass Mouse Pad in Bangladesh | ${SITE_NAME}`,
      description:
        "TRIZEN TRIPAD, premium esports glass mouse pads. Buy online in Bangladesh with COD.",
      url: `${SITE_URL}${path}`,
    },
  };
}

export function esportsMousePadShopMetadata(): Metadata {
  const path = "/shop";
  return {
    title: "Esports Mouse Pad in Bangladesh",
    description:
      "Shop esports mouse pad in Bangladesh at TRIZEN, glass TRIPAD, soft pads, mouse skates & hand sleeves. Competitive grade gear with COD, bKash & Nagad.",
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
      "Esports mouse pad in Bangladesh, TRIZEN TRIPAD glass pads, soft pads, skates & sleeves. COD, bKash, Nagad & order tracking.",
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: SITE_TITLE,
      url: SITE_URL,
    },
  };
}
