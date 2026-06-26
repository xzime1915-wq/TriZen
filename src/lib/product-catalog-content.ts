import { stringifyJsonField } from "./product-data";

/** Display names for TriPad product modules */
export const TRIPAD_MODEL_NAMES = {
  v1Black: "TP - V1 (black)",
  v1White: "TP - V1 (White)",
  v2Black: "TP - V2 (black)",
  v2White: "TP - V2 (white)",
} as const;

const TRIPAD_INVENTORY = {
  v1Black: { sku: "TS-GP-V1-BLK", barcode: "890000000002" },
  v1White: { sku: "TS-GP-V1-WHT", barcode: "890000000001" },
  v2Black: { sku: "TS-GP-V2-BLK", barcode: "890000000004" },
  v2White: { sku: "TS-GP-V2-WHT", barcode: "890000000003" },
} as const;

/** TRIPAD glass mouse pad — physical size (all V1 & V2 editions) */
export const TRIPAD_DIMENSIONS = "490 × 430 × 3 mm";

const tripadSpecsShared = [
  { label: "Dimensions (L × W × H)", value: `${TRIPAD_DIMENSIONS}` },
  { label: "Thickness", value: "3 mm" },
  { label: "Material", value: "Tempered glass" },
  { label: "Surface", value: "Ultra smooth, low friction" },
  { label: "Base", value: "Non slip rubber, stays fixed under fast swipes" },
  { label: "Compatibility", value: "All gaming mice (wired & wireless)" },
  { label: "Ideal For", value: "Esports, FPS, MOBA & ranked play" },
  { label: "Care", value: "Wipe with a soft cloth, avoid harsh chemicals" },
  { label: "Sold By", value: "TRIZEN Store (Official)" },
];

export const tripadFeatures = [
  `Generous playing area, ${TRIPAD_DIMENSIONS} (L × W × H)`,
  "Ultra smooth tempered glass surface, super fast, low friction glide",
  "Engineered for competitive esports: precision flicks, tracking & aim",
  "Hall effect level consistency, same feel across the entire pad",
  "Scratch resistant glass with premium TRIZEN branding",
  "Stable non slip base, stays fixed during intense matches",
  "Easy maintenance, wipe clean in seconds",
  "Compatible with all gaming mice (wired & wireless)",
  "Built for Bangladesh esports & daily competitive play",
];

export const tripadSpecs = [
  { label: "Product", value: "TP-V1 Glass Mouse Pad" },
  ...tripadSpecsShared,
];

export function tripadLongDescription(variant: "black" | "white") {
  const model =
    variant === "black" ? TRIPAD_MODEL_NAMES.v1Black : TRIPAD_MODEL_NAMES.v1White;
  const accent =
    variant === "black"
      ? "matte black finish that looks clean on any battlestation"
      : "clean white aesthetic perfect for minimal desk setups";

  return `The ${model} is a premium tempered glass mouse pad built for players who care about speed, control, and consistency.

Our glass surface is tuned for competitive esports, you get an ultra smooth glide with low friction, so micro adjustments, flicks, and tracking feel sharp and predictable match after match.

This edition features a ${accent}. TRIZEN branding is applied with a durable finish designed for daily use.

Whether you play FPS, battle royale, or MOBA, ${model} helps your mouse move freely while the pad stays planted on your desk thanks to the stable base.

Order from TRIZEN Store with Cash on Delivery, bKash, Nagad, or bank transfer. We ship across Bangladesh.`;
}

export function tripadShortDescription(variant: "black" | "white") {
  return variant === "black"
    ? "Premium glass mouse pad for esports. Ultra smooth glide, durable tempered glass, matte black TRIZEN edition."
    : "Premium glass mouse pad, white edition. Same esports grade glide, clean desk aesthetic, TRIZEN quality.";
}

export const tripadV2Features = [
  `Same pro size as V1, ${TRIPAD_DIMENSIONS} (L × W × H)`,
  "Next gen TRIPAD design, bold vertical TRIZEN branding",
  "Same esports grade tempered glass glide as V1",
  "Refined surface feel for precision tracking and flicks",
  "Scratch resistant glass built for daily competitive use",
  "Stable non slip base, locked during intense matches",
  "Easy maintenance, wipe clean in seconds",
  "Compatible with all gaming mice (wired & wireless)",
  "Upcoming at TRIZEN Store",
];

export const tripadV2Specs = [
  { label: "Product", value: "TP-V2 Glass Mouse Pad" },
  { label: "Series", value: "TP-V2 (Upcoming)" },
  ...tripadSpecsShared,
  { label: "Design", value: "Vertical TRIZEN signature layout" },
];

export function tripadV2LongDescription(variant: "black" | "white") {
  const model =
    variant === "black" ? TRIPAD_MODEL_NAMES.v2Black : TRIPAD_MODEL_NAMES.v2White;
  const accent =
    variant === "black"
      ? "deep black glass with high contrast white TRIZEN lettering along the edge"
      : "light silver white glass with bold black TRIZEN lettering along the edge";

  return `${model} is the next chapter of our glass mouse pad line, same competitive DNA as V1, with a fresh design language players asked for.

The V2 layout features ${accent}. The surface is tuned for ultra smooth, low friction glide so tracking and micro adjustments stay predictable.

${model} is upcoming at TRIZEN Store. Register interest by visiting the product page. We will announce launch dates on this site.`;
}

export function tripadV2ShortDescription(variant: "black" | "white") {
  return variant === "black"
    ? "TRIPAD V2 Black, new vertical TRIZEN design. Same glass glide. Upcoming."
    : "TRIPAD V2 White, clean silver aesthetic, bold branding. Upcoming.";
}

export function buildTripadSpecs(variant: "black" | "white") {
  const edition = variant === "black" ? "Black" : "White";
  const inventory =
    variant === "black" ? TRIPAD_INVENTORY.v1Black : TRIPAD_INVENTORY.v1White;
  return [
    { label: "Product", value: "TP-V1 Glass Mouse Pad" },
    { label: "Edition", value: edition },
    { label: "SKU", value: inventory.sku },
    ...tripadSpecsShared,
  ];
}

export function buildTripadV2Specs(variant: "black" | "white") {
  const edition = variant === "black" ? "Black" : "White";
  const inventory =
    variant === "black" ? TRIPAD_INVENTORY.v2Black : TRIPAD_INVENTORY.v2White;
  return [
    { label: "Product", value: "TP-V2 Glass Mouse Pad" },
    { label: "Series", value: "TP-V2 (Upcoming)" },
    { label: "Edition", value: edition },
    { label: "SKU", value: inventory.sku },
    ...tripadSpecsShared,
    { label: "Design", value: "Vertical TRIZEN signature layout" },
  ];
}

export function buildTripadV2ProductData(variant: "black" | "white") {
  const isBlack = variant === "black";
  const inventory = isBlack
    ? TRIPAD_INVENTORY.v2Black
    : TRIPAD_INVENTORY.v2White;
  return {
    name: isBlack ? "TP - V2 (black)" : "TP - V2 (white)",
    slug: isBlack ? "trizen-tripad-v2-black" : "trizen-tripad-v2-white",
    description: tripadV2ShortDescription(variant),
    longDescription: tripadV2LongDescription(variant),
    features: stringifyJsonField(tripadV2Features),
    specifications: stringifyJsonField(buildTripadV2Specs(variant)),
    galleryImages: stringifyJsonField([
      isBlack ? "/products/tripad-v2-black.png" : "/products/tripad-v2-white.png",
    ]),
    colors: stringifyJsonField([]),
    sku: inventory.sku,
    barcode: inventory.barcode,
    tag: "Upcoming",
    image: isBlack ? "/products/tripad-v2-black.png" : "/products/tripad-v2-white.png",
    category: "Mouse Pads",
    featured: true,
  };
}

export function buildTripadProductData(variant: "black" | "white") {
  const isBlack = variant === "black";
  const inventory = isBlack
    ? TRIPAD_INVENTORY.v1Black
    : TRIPAD_INVENTORY.v1White;
  return {
    name: isBlack ? "TP - V1 (black)" : "TP - V1 (White)",
    slug: isBlack ? "trizen-tripad-v1-black" : "trizen-tripad-v1-white",
    description: tripadShortDescription(variant),
    longDescription: tripadLongDescription(variant),
    features: stringifyJsonField(tripadFeatures),
    specifications: stringifyJsonField(buildTripadSpecs(variant)),
    galleryImages: stringifyJsonField([
      isBlack ? "/products/tripad-v1-black.png" : "/products/tripad-v1-white.png",
    ]),
    colors: stringifyJsonField([]),
    sku: inventory.sku,
    barcode: inventory.barcode,
    tag: isBlack ? "Hot" : null,
    image: isBlack ? "/products/tripad-v1-black.png" : "/products/tripad-v1-white.png",
    category: "Mouse Pads",
    featured: true,
  };
}

export const ptfeMouseSkatesFeatures = [
  "PTFE glide dots for smooth, low friction mouse movement",
  "Universal dot layout for quick mouse tuning",
  "Rounded edge feel for controlled glide",
  "White skates on TRIZEN branded backing sheet",
  "Easy peel and apply installation",
  "Great for refreshing worn mouse feet",
  "Designed for competitive gaming setups",
];

export function buildPtfeMouseSkatesProductData() {
  const sku = "TS-MS-PTFE";

  return {
    name: "TRIZEN PTFE Mouse Skates",
    slug: "trizen-ptfe-mouse-skates",
    description:
      "PTFE mouse skate dots for smoother glide, lower friction, and quick mouse tuning.",
    longDescription:
      "TRIZEN PTFE Mouse Skates are made for players who want a smoother, cleaner glide from their gaming mouse.\n\nThe universal dot layout makes installation simple across many mouse shapes. Apply the skates to refresh worn feet, fine tune glide, or prepare a mouse for competitive play.\n\nOrder from TRIZEN Store with Cash on Delivery, bKash, Nagad, or bank transfer. We ship across Bangladesh.",
    features: stringifyJsonField(ptfeMouseSkatesFeatures),
    specifications: stringifyJsonField([
      { label: "Product", value: "PTFE Mouse Skates" },
      { label: "Category", value: "Mouse Skates" },
      { label: "Material", value: "PTFE" },
      { label: "Type", value: "Universal dot skates" },
      { label: "Color", value: "White" },
      { label: "SKU", value: sku },
      { label: "Sold By", value: "TRIZEN Store (Official)" },
    ]),
    galleryImages: stringifyJsonField([
      "/products/trizen-ptfe-mouse-skates.webp",
      "/products/trizen-ptfe-mouse-skates-detail.webp",
      "/products/trizen-ptfe-mouse-skates.png",
    ]),
    colors: stringifyJsonField([]),
    sku,
    barcode: "890000000005",
    tag: "Upcoming",
    image: "/products/trizen-ptfe-mouse-skates.webp",
    category: "Mouse Skates",
    featured: false,
  };
}

const TRIPAD_CATALOG_BY_SLUG: Record<
  string,
  ReturnType<typeof buildTripadProductData> | ReturnType<typeof buildTripadV2ProductData>
> = {
  "trizen-tripad-v1-black": buildTripadProductData("black"),
  "trizen-tripad-v1-white": buildTripadProductData("white"),
  "trizen-tripad-v2-black": buildTripadV2ProductData("black"),
  "trizen-tripad-v2-white": buildTripadV2ProductData("white"),
};

/** Catalog copy for TriPad slugs — keeps product page in sync even before DB migration. */
export function getTripadCatalogBySlug(slug: string) {
  return TRIPAD_CATALOG_BY_SLUG[slug] ?? null;
}

/** Default rich content for non-tripad products by category */
export function defaultCategoryContent(category: string, name: string) {
  return {
    longDescription: `${name} from TRIZEN Store, premium esports gear selected for competitive players in Bangladesh.\n\nBuilt for durability, performance, and everyday use. Order with COD, bKash, Nagad, or bank transfer.`,
    features: stringifyJsonField([
      "Official TRIZEN Store product",
      "Quality checked before dispatch",
      "Fast delivery across Bangladesh",
      "COD & mobile banking accepted",
    ]),
    specifications: stringifyJsonField([
      { label: "Category", value: category },
      { label: "Brand", value: "TRIZEN Store" },
      { label: "Sold By", value: "TRIZEN Store (Official)" },
    ]),
  };
}
