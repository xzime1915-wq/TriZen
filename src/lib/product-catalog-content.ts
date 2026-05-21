import { stringifyJsonField } from "./product-data";

export const tripadFeatures = [
  "Ultra-smooth tempered glass surface — super-fast, low-friction glide",
  "Engineered for competitive esports: precision flicks, tracking & aim",
  "Hall-effect level consistency — same feel across the entire pad",
  "Scratch-resistant glass with premium TriZen branding",
  "Stable non-slip base — stays fixed during intense matches",
  "Easy maintenance — wipe clean in seconds",
  "Compatible with all gaming mice (wired & wireless)",
  "Built for Bangladesh esports & daily competitive play",
];

export const tripadSpecs = [
  { label: "Product", value: "TriZen TriPad V1 Glass Mouse Pad" },
  { label: "Material", value: "Tempered glass" },
  { label: "Surface", value: "Ultra-smooth / low friction" },
  { label: "Base", value: "Non-slip rubber / stable grip" },
  { label: "Compatibility", value: "All mouse types (FPS, MOBA, BR)" },
  { label: "Ideal For", value: "Esports, ranked play & long sessions" },
  { label: "Care", value: "Wipe with soft cloth — avoid harsh chemicals" },
  { label: "Warranty", value: "Official TriZen store support" },
  { label: "Brand", value: "TriZen Store" },
];

export function tripadLongDescription(variant: "black" | "white") {
  const accent =
    variant === "black"
      ? "matte black finish that looks clean on any battlestation"
      : "clean white aesthetic perfect for minimal desk setups";

  return `The TriZen TriPad V1 is a premium tempered glass mouse pad built for players who care about speed, control, and consistency.

Our glass surface is tuned for competitive esports — you get an ultra-smooth glide with low friction, so micro-adjustments, flicks, and tracking feel sharp and predictable match after match.

This edition features a ${accent}. TriZen branding is applied with a durable finish designed for daily use.

Whether you play FPS, battle royale, or MOBA, TriPad V1 helps your mouse move freely while the pad stays planted on your desk thanks to the stable base.

Order from TriZen Store with Cash on Delivery, bKash, Nagad, or bank transfer — we ship across Bangladesh.`;
}

export function tripadShortDescription(variant: "black" | "white") {
  return variant === "black"
    ? "Premium glass mouse pad for esports. Ultra-smooth glide, durable tempered glass, matte black TriZen edition."
    : "Premium glass mouse pad — white edition. Same esports-grade glide, clean desk aesthetic, TriZen quality.";
}

export const tripadV2Features = [
  "Next-gen TriPad design — bold vertical TriZen branding",
  "Same esports-grade tempered glass glide as V1",
  "Refined surface feel for precision tracking and flicks",
  "Scratch-resistant glass built for daily competitive use",
  "Stable non-slip base — locked during intense matches",
  "Easy maintenance — wipe clean in seconds",
  "Compatible with all gaming mice (wired & wireless)",
  "Upcoming at TriZen Store",
];

export const tripadV2Specs = [
  { label: "Product", value: "TriZen TriPad V2 Glass Mouse Pad" },
  { label: "Series", value: "TriPad V2 (Upcoming)" },
  { label: "Material", value: "Tempered glass" },
  { label: "Design", value: "Vertical TriZen signature layout" },
  { label: "Surface", value: "Ultra-smooth / low friction" },
  { label: "Ideal For", value: "Esports & ranked play" },
  { label: "Brand", value: "TriZen Store" },
];

export function tripadV2LongDescription(variant: "black" | "white") {
  const accent =
    variant === "black"
      ? "deep black glass with high-contrast white TriZen lettering along the edge"
      : "light silver-white glass with bold black TriZen lettering along the edge";

  return `TriZen TriPad V2 is the next chapter of our glass mouse pad line — same competitive DNA as V1, with a fresh design language players asked for.

The V2 layout features ${accent}. The surface is tuned for ultra-smooth, low-friction glide so tracking and micro-adjustments stay predictable.

TriPad V2 is upcoming at TriZen Store. Register interest by visiting the product page — we will announce launch dates on this site.`;
}

export function tripadV2ShortDescription(variant: "black" | "white") {
  return variant === "black"
    ? "TriPad V2 Black — new vertical TriZen design. Same glass glide. Upcoming."
    : "TriPad V2 White — clean silver aesthetic, bold branding. Upcoming.";
}

export function buildTripadV2ProductData(variant: "black" | "white") {
  const isBlack = variant === "black";
  return {
    name: isBlack ? "TriZen TriPad V2 Black" : "TriZen TriPad V2 White",
    slug: isBlack ? "trizen-tripad-v2-black" : "trizen-tripad-v2-white",
    description: tripadV2ShortDescription(variant),
    longDescription: tripadV2LongDescription(variant),
    features: stringifyJsonField(tripadV2Features),
    specifications: stringifyJsonField(tripadV2Specs),
    galleryImages: stringifyJsonField([
      isBlack ? "/products/tripad-v2-black.png" : "/products/tripad-v2-white.png",
    ]),
    colors: stringifyJsonField([]),
    sku: isBlack ? "TZ-TRIPAD-V2-BLK" : "TZ-TRIPAD-V2-WHT",
    tag: "Upcoming",
    image: isBlack ? "/products/tripad-v2-black.png" : "/products/tripad-v2-white.png",
    category: "Mouse Pads",
    featured: true,
  };
}

export function buildTripadProductData(variant: "black" | "white") {
  const isBlack = variant === "black";
  return {
    name: isBlack ? "TriZen TriPad V1 Black" : "TriZen TriPad V1 White",
    slug: isBlack ? "trizen-tripad-v1-black" : "trizen-tripad-v1-white",
    description: tripadShortDescription(variant),
    longDescription: tripadLongDescription(variant),
    features: stringifyJsonField(tripadFeatures),
    specifications: stringifyJsonField(tripadSpecs),
    galleryImages: stringifyJsonField([
      isBlack ? "/products/tripad-v1-black.png" : "/products/tripad-v1-white.png",
    ]),
    colors: stringifyJsonField([]),
    sku: isBlack ? "TZ-TRIPAD-V1-BLK" : "TZ-TRIPAD-V1-WHT",
    tag: isBlack ? "Hot" : null,
    image: isBlack ? "/products/tripad-v1-black.png" : "/products/tripad-v1-white.png",
    category: "Mouse Pads",
    featured: true,
  };
}

/** Default rich content for non-tripad products by category */
export function defaultCategoryContent(category: string, name: string) {
  return {
    longDescription: `${name} from TriZen Store — premium esports gear selected for competitive players in Bangladesh.\n\nBuilt for durability, performance, and everyday use. Order with COD, bKash, Nagad, or bank transfer.`,
    features: stringifyJsonField([
      "Official TriZen Store product",
      "Quality checked before dispatch",
      "Fast delivery across Bangladesh",
      "COD & mobile banking accepted",
    ]),
    specifications: stringifyJsonField([
      { label: "Category", value: category },
      { label: "Brand", value: "TriZen Store" },
      { label: "Sold By", value: "TriZen Store (Official)" },
    ]),
  };
}
