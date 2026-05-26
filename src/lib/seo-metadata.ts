import type { Metadata } from "next";
import {
  SEO_ESPORTS_MOUSE_PAD_BD,
  SEO_GLASS_MOUSE_PAD_BD,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site-config";

export function glassMousePadShopMetadata(): Metadata {
  const path = "/shop?gear=glass-mouse-pad";
  return {
    title: "Glass Mouse Pad in Bangladesh",
    description:
      "Esports glass mouse pad in Bangladesh — TriZen TriPad tempered glass, low-friction glide. COD, bKash, Nagad & nationwide delivery.",
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Glass Mouse Pad in Bangladesh | ${SITE_NAME}`,
      description:
        "TriZen TriPad — premium esports glass mouse pads. Buy online in Bangladesh with COD.",
      url: `${SITE_URL}${path}`,
    },
  };
}

export function esportsMousePadShopMetadata(): Metadata {
  const path = "/shop";
  return {
    title: "Esports Mouse Pad in Bangladesh",
    description:
      "Shop esports mouse pad in Bangladesh at TriZen — glass TriPad, soft pads, mouse skates & hand sleeves. Competitive-grade gear with COD, bKash & Nagad.",
    alternates: { canonical: `${SITE_URL}${path}` },
    openGraph: {
      title: `Esports Mouse Pad in Bangladesh | ${SITE_NAME}`,
      description:
        "TriZen Store — esports mouse pads and gaming desk gear shipped across Bangladesh.",
      url: `${SITE_URL}${path}`,
    },
  };
}

export function homePageMetadata(): Metadata {
  return {
    title: `${SEO_ESPORTS_MOUSE_PAD_BD} · ${SEO_GLASS_MOUSE_PAD_BD}`,
    description:
      "Esports mouse pad in Bangladesh — TriZen TriPad glass pads, soft pads, skates & sleeves. COD, bKash, Nagad & order tracking.",
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: `Esports & Glass Mouse Pad Bangladesh | ${SITE_NAME}`,
      url: SITE_URL,
    },
  };
}
