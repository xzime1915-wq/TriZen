import type { ShopGearLine } from "@/lib/shop-gears";

export type FaqItem = {
  question: string;
  answer: string;
};

export const HOME_SEO_TITLE =
  "Esports Mouse Pad in Bangladesh, Glass TRIPAD & Gaming Gear";

export const HOME_SEO_SUBTITLE =
  "Esports mouse pads, glass TRIPAD, soft pads, skates & sleeves";

export const HOME_SEO_PARAGRAPHS = [
  "TRIZEN Store is Bangladesh's shop for esports mouse pad buyers who want glide, control, and consistency. Browse glass mouse pads (TRIPAD V1 & V2), soft mouse pads, mouse skates, and hand sleeves, shipped nationwide.",
  "Order in-stock items with Cash on Delivery, bKash, Nagad, or bank transfer. Sign in to checkout and track your order anytime from our website.",
  "Whether you are upgrading from a cloth pad or building a new battlestation, TRIZEN gear is tuned for FPS, MOBA, and long ranked sessions.",
];

export const HOME_FAQS: FaqItem[] = [
  {
    question: "What does TRIZEN Store sell?",
    answer:
      "TRIZEN Store sells premium esports gear, glass mouse pads (TRIPAD V1), soft mouse pads, mouse skates, and hand sleeves. New items are added to the shop as they launch.",
  },
  {
    question: "Which payment options are available?",
    answer:
      "You can pay with Cash on Delivery (COD), bKash, Nagad, or bank transfer. Mobile wallet and bank details are shown at checkout.",
  },
  {
    question: "Do you offer Cash on Delivery?",
    answer:
      "Yes. COD is available for eligible orders across Bangladesh. Select Cash on Delivery at checkout and pay when your order arrives.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Use the Track Your Order page on our website with your order number and phone number. You will also receive updates as your order is processed and shipped.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery times depend on your location in Bangladesh. Most orders are processed quickly; allow a few business days for courier delivery outside Dhaka.",
  },
  {
    question: "What is the difference between TRIPAD V1 and V2?",
    answer:
      "Both use esports grade tempered glass with the same pro size (490 × 430 × 3 mm). V1 is in stock now. V2 features refreshed vertical TRIZEN branding and is marked Upcoming until launch.",
  },
  {
    question: "How can I contact TRIZEN Store?",
    answer:
      "Email info@trizenstorebd.com or call 01778741431. You can also use the Contact page for general questions about products and orders.",
  },
  {
    question: "Is TRIPAD suitable for all mice?",
    answer:
      "Yes. TRIPAD works with all gaming mice, wired and wireless, on its ultra smooth glass surface.",
  },
];

export const ALL_PRODUCTS_FAQS: FaqItem[] = [
  {
    question: "Does TRIZEN Store ship nationwide?",
    answer:
      "Yes. We deliver across Bangladesh. Most orders ship within a few business days; delivery times vary by district outside Dhaka.",
  },
  {
    question: "Where can I learn about new products or campaigns?",
    answer:
      "Check the shop page for upcoming gear, follow TRIZEN Store on social media, and subscribe to the newsletter for launch updates and offers.",
  },
  {
    question: "How do I become part of the TRIZEN community?",
    answer:
      "Follow us on social media, share your setup, and tag TRIZEN Store. For orders and support, email info@trizenstorebd.com or call 01778741431.",
  },
  {
    question: "Which payment options are available?",
    answer:
      "Cash on Delivery, bKash, Nagad, and bank transfer are accepted at checkout. Payment details are shown before you confirm your order.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Use Track Your Order on trizenstorebd.com with your order number and phone. You will see updates as your order is processed and shipped.",
  },
];

const PRODUCT_FAQ_COMMON: FaqItem[] = [
  {
    question: "Do you provide Cash on Delivery?",
    answer:
      "Yes. COD is available for in-stock items shipped within Bangladesh. Select Cash on Delivery at checkout and pay when your parcel arrives.",
  },
];

function gearSpecificFaqs(
  productName: string,
  gearLine: ShopGearLine,
  isUpcoming: boolean,
): FaqItem[] {
  switch (gearLine) {
    case "glass-mouse-pad":
      return [
        {
          question: `What is ${productName}?`,
          answer: isUpcoming
            ? `${productName} is an upcoming TRIZEN TRIPAD glass mouse pad with edition-specific branding. It shares the same competitive glass glide as TRIPAD V1 — check back for launch updates.`
            : `${productName} is a TRIZEN tempered glass mouse pad built for esports. The surface is ultra smooth and low friction for precise tracking, flicks, and long sessions.`,
        },
        {
          question: "What are the TRIPAD dimensions?",
          answer:
            "TRIPAD editions measure 490 × 430 × 3 mm (L × W × H), a generous playing area for wide swipes and arm aiming.",
        },
        {
          question: "How should I clean my TRIPAD?",
          answer:
            "Wipe the glass surface with a soft, dry or slightly damp cloth. Avoid harsh chemicals or abrasive pads to keep the glide consistent.",
        },
      ];
    case "soft-mouse-pad":
      return [
        {
          question: `What is ${productName}?`,
          answer: isUpcoming
            ? `${productName} is an upcoming TRIZEN soft mouse pad with a cloth surface tuned for control and comfort. It will be listed on the shop when it launches.`
            : `${productName} is a TRIZEN soft mouse pad with a cloth surface for precise control and comfortable long sessions.`,
        },
      ];
    case "skates":
      return [
        {
          question: `What is ${productName}?`,
          answer: `${productName} is low-friction mouse skate replacement feet from TRIZEN, built for smooth, consistent glide on your gaming mouse.`,
        },
        {
          question: "Are these skates compatible with my mouse?",
          answer:
            "Check the product description and specifications for supported mouse models. If you are unsure, contact us with your mouse model before ordering.",
        },
      ];
    case "hand-sleeves":
      return [
        {
          question: `What is ${productName}?`,
          answer: isUpcoming
            ? `${productName} is an upcoming TRIZEN hand sleeve designed to reduce friction and improve comfort during long ranked sessions.`
            : `${productName} is a TRIZEN compression hand sleeve that reduces friction between your arm and the desk for smoother mouse movement.`,
        },
      ];
    default:
      return [
        {
          question: `What is ${productName}?`,
          answer: `${productName} is premium esports gear from TRIZEN Store, built for competitive play in Bangladesh.`,
        },
      ];
  }
}

export function getProductFaqs(
  productName: string,
  gearLine: ShopGearLine,
  isUpcoming: boolean,
): FaqItem[] {
  return [
    ...gearSpecificFaqs(productName, gearLine, isUpcoming),
    ...PRODUCT_FAQ_COMMON,
    ...ALL_PRODUCTS_FAQS,
  ];
}
