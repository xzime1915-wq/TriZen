export const SITE_URL = "https://trizenstore.com.bd";

export const SITE_NAME = "TRIZEN Store";

/** Invoice / packing documents — always full caps. */
export const INVOICE_STORE_NAME = "TRIZEN STORE";

export const SITE_TITLE =
  "Esports Mouse Pad in Bangladesh | TRIZEN Store";

export const SITE_DESCRIPTION =
  "Buy esports and gaming mouse pads in Bangladesh from TRIZEN Store. Shop TRIPAD glass pads, large mouse pads, mouse skates and hand sleeves with nationwide delivery.";

export const SEO_GLASS_MOUSE_PAD_BD =
  "Glass mouse pad in Bangladesh, TRIZEN TRIPAD large gaming mouse pad";

export const SEO_ESPORTS_MOUSE_PAD_BD =
  "Esports mouse pad in Bangladesh, gaming mouse pad price in BD";

export const SEO_MOUSE_PAD_KEYWORDS = [
  "esports mouse pad in Bangladesh",
  "gaming mouse pad in Bangladesh",
  "gaming mouse pad price in Bangladesh",
  "mouse pad price in Bangladesh",
  "mouse pad price in BD",
  "glass mouse pad Bangladesh",
  "glass mousepad Bangladesh",
  "large mouse pad Bangladesh",
  "large gaming mouse pad",
  "FPS mouse pad Bangladesh",
  "Valorant mouse pad Bangladesh",
  "CS2 mouse pad Bangladesh",
  "gaming mousepad BD",
  "TRIPAD glass mouse pad",
  "mouse skates Bangladesh",
  "gaming hand sleeve Bangladesh",
] as const;

export const SITE_CONTACT = {
  phone: "+8801778741431",
  phoneDisplay: "01778741431",
  email: "support@trizenstore.com.bd",
} as const;

export const SUPPORT_EMAIL = SITE_CONTACT.email;

export const SITE_SOCIAL = [
  "https://www.facebook.com/trizenstore",
  "https://discord.gg/sRtArTTvSf",
  "https://www.youtube.com/@TRIZENSTORE",
] as const;

/** Primary nav URLs — helps Google understand sitelink candidates */
export const SITE_NAV_LINKS = [
  { name: "Shop", url: `${SITE_URL}/shop` },
  {
    name: "Gaming Mouse Pad Price in Bangladesh",
    url: `${SITE_URL}/shop`,
  },
  {
    name: "Glass Mouse Pad Bangladesh",
    url: `${SITE_URL}/shop?gear=glass-mouse-pad`,
  },
  { name: "Soft Mouse Pad", url: `${SITE_URL}/shop?gear=soft-mouse-pad` },
  { name: "Mouse Skates", url: `${SITE_URL}/shop?gear=skates` },
  { name: "Hand Sleeves", url: `${SITE_URL}/shop?gear=hand-sleeves` },
  { name: "Track Your Order", url: `${SITE_URL}/track-order` },
  { name: "Contact Us", url: `${SITE_URL}/contact` },
  { name: "About", url: `${SITE_URL}/about` },
] as const;
