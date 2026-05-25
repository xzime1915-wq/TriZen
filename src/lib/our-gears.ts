export type GearStatus = "grab" | "upcoming";

export type OurGearCard = {
  id: string;
  titleLine1: string;
  titleLine2: string;
  status: GearStatus;
  statusLabel: string;
  taglineLine1: string;
  taglineLine2: string;
  /** Replace with your asset under /public/products/our-gears/ */
  image: string;
  href: string;
};

/** Home “Our Gears” row — swap `image` paths when your four assets are ready */
export const OUR_GEARS: OurGearCard[] = [
  {
    id: "glass-mouse-pad",
    titleLine1: "Glass",
    titleLine2: "Mouse Pad",
    status: "grab",
    statusLabel: "Grab Now",
    taglineLine1: "Unparalleled glide.",
    taglineLine2: "Ultimate control.",
    image: "/products/our-gears/glass-mouse-pad.png",
    href: "/shop?gear=glass-mouse-pad",
  },
  {
    id: "soft-mouse-pad",
    titleLine1: "Soft",
    titleLine2: "Mouse Pad",
    status: "upcoming",
    statusLabel: "Upcoming",
    taglineLine1: "Soft touch.",
    taglineLine2: "Precise control.",
    image: "/products/our-gears/soft-mouse-pad.png",
    href: "/shop?gear=soft-mouse-pad",
  },
  {
    id: "skates",
    titleLine1: "Skates",
    titleLine2: "",
    status: "grab",
    statusLabel: "Grab Now",
    taglineLine1: "Low friction.",
    taglineLine2: "Max performance.",
    image: "/products/our-gears/skates.png",
    href: "/shop?gear=skates",
  },
  {
    id: "hand-sleeves",
    titleLine1: "Hand",
    titleLine2: "Sleeves",
    status: "upcoming",
    statusLabel: "Upcoming",
    taglineLine1: "Less friction.",
    taglineLine2: "More focus.",
    image: "/products/our-gears/hand-sleeves.png",
    href: "/shop?gear=hand-sleeves",
  },
];

/** Temporary visuals until you add files in public/products/our-gears/ */
export const OUR_GEARS_FALLBACK_IMAGES: Record<string, string> = {
  "glass-mouse-pad": "/products/tripad-v1-black.png",
  "soft-mouse-pad": "/products/tripad-anti-slip-base.png",
  skates: "/products/tripad-3mm-feature.png",
  "hand-sleeves": "/products/engineered-glide.png",
};
