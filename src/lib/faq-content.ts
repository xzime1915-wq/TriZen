export type FaqItem = {
  question: string;
  answer: string;
};

export const HOME_SEO_TITLE =
  "Esports Mouse Pad in Bangladesh — Glass TriPad & Gaming Gear";

export const HOME_SEO_SUBTITLE =
  "Esports mouse pads, glass TriPad, soft pads, skates & sleeves";

export const HOME_SEO_PARAGRAPHS = [
  "TriZen Store is Bangladesh's shop for esports mouse pad buyers who want glide, control, and consistency. Browse glass mouse pads (TriPad V1 & V2), soft mouse pads, mouse skates, and hand sleeves — shipped nationwide.",
  "Order in-stock items with Cash on Delivery, bKash, Nagad, or bank transfer. Sign in to checkout and track your order anytime from our website.",
  "Whether you are upgrading from a cloth pad or building a new battlestation, TriZen gear is tuned for FPS, MOBA, and long ranked sessions.",
];

export const HOME_FAQS: FaqItem[] = [
  {
    question: "What does TriZen Store sell?",
    answer:
      "TriZen Store sells premium esports gear — glass mouse pads (TriPad V1), soft mouse pads, mouse skates, and hand sleeves. New items are added to the shop as they launch.",
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
    question: "What is the difference between TriPad V1 and V2?",
    answer:
      "Both use esports-grade tempered glass with the same pro size (490 × 430 × 3 mm). V1 is in stock now. V2 features refreshed vertical TriZen branding and is marked Upcoming until launch.",
  },
  {
    question: "How can I contact TriZen Store?",
    answer:
      "Email info@trizenstorebd.com or call 01778741431. You can also use the Contact page for general questions about products and orders.",
  },
  {
    question: "Is TriPad suitable for all mice?",
    answer:
      "Yes. TriPad works with all gaming mice — wired and wireless — on its ultra-smooth glass surface.",
  },
];

const PRODUCT_FAQ_COMMON: FaqItem[] = [
  {
    question: "Which payment options can I use for this product?",
    answer:
      "Cash on Delivery, bKash, Nagad, and bank transfer are accepted at checkout. Upcoming products can still be viewed; you will be notified when they are available to order.",
  },
  {
    question: "Do you provide Cash on Delivery?",
    answer:
      "Yes, COD is available for in-stock items shipped within Bangladesh. Select COD during checkout and pay when your parcel arrives.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Go to Track Your Order on trizenstorebd.com and enter your order number and phone. Status updates appear as we process and ship your item.",
  },
  {
    question: "How should I clean my TriPad?",
    answer:
      "Wipe the glass surface with a soft, dry or slightly damp cloth. Avoid harsh chemicals or abrasive pads to keep the glide consistent.",
  },
];

export function getProductFaqs(productName: string, isUpcoming: boolean): FaqItem[] {
  const specific: FaqItem[] = [
    {
      question: `What is ${productName}?`,
      answer: isUpcoming
        ? `${productName} is an upcoming TriZen TriPad glass mouse pad. It shares the same competitive glass glide as V1 with edition-specific branding. Check back for launch updates.`
        : `${productName} is a TriZen tempered glass mouse pad built for esports. The surface is ultra-smooth and low-friction for precise tracking, flicks, and long sessions.`,
    },
    {
      question: "What are the dimensions?",
      answer:
        "TriPad editions measure 490 × 430 × 3 mm (L × W × H) — a generous playing area for wide swipes and arm aiming.",
    },
    {
      question: "Will this pad slip during fast swipes?",
      answer:
        "TriPad uses a stable non-slip base designed to stay planted during intense matches while the glass top allows free mouse movement.",
    },
  ];

  return [...specific, ...PRODUCT_FAQ_COMMON];
}
