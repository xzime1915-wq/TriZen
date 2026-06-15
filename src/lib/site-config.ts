export const SITE_URL = "https://trizenstore.com.bd";

export const SITE_NAME = "TRIZEN Store";

export const SITE_TITLE = "TRIZEN STORE ESPORTS GEARS";

export const SITE_DESCRIPTION =
  "Esports mouse pad in Bangladesh, TRIZEN Store sells TRIPAD glass pads, soft pads, skates & sleeves. COD, bKash, Nagad & nationwide delivery.";

export const SEO_GLASS_MOUSE_PAD_BD =
  "Glass mouse pad in Bangladesh, TRIZEN TRIPAD";

export const SEO_ESPORTS_MOUSE_PAD_BD =
  "Esports mouse pad in Bangladesh, TRIZEN Store";

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
  { name: "Glass Mouse Pad", url: `${SITE_URL}/shop?gear=glass-mouse-pad` },
  { name: "Soft Mouse Pad", url: `${SITE_URL}/shop?gear=soft-mouse-pad` },
  { name: "Mouse Skates", url: `${SITE_URL}/shop?gear=skates` },
  { name: "Hand Sleeves", url: `${SITE_URL}/shop?gear=hand-sleeves` },
  { name: "Track Your Order", url: `${SITE_URL}/track-order` },
  { name: "Contact Us", url: `${SITE_URL}/contact` },
  { name: "About", url: `${SITE_URL}/about` },
] as const;
