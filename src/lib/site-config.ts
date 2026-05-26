export const SITE_URL = "https://trizenstore.com.bd";

export const SITE_NAME = "TriZen Store";

export const SITE_DESCRIPTION =
  "Bangladesh's premium esports gear shop — glass & soft mouse pads, mouse skates, and hand sleeves. TriPad V1 in stock. COD, bKash, Nagad & order tracking.";

export const SITE_CONTACT = {
  phone: "+8801778741431",
  phoneDisplay: "01778741431",
  email: "info@trizenstorebd.com",
} as const;

export const SITE_SOCIAL = [
  "https://www.facebook.com/trizenstore",
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
