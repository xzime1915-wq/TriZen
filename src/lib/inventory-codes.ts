const CATEGORY_CODES: Record<string, string> = {
  "glass pad": "GP",
  "glass pads": "GP",
  "glass mouse pad": "GP",
  "glass mouse pads": "GP",
  "mouse pad": "GP",
  "mouse pads": "GP",
  "mouse skates": "MS",
  "mouse skate": "MS",
  skates: "MS",
  "hand sleeve": "HS",
  "hand sleeves": "HS",
  sleeve: "HS",
  sleeves: "HS",
};

const VARIANT_CODES: Record<string, string> = {
  black: "BLK",
  white: "WHT",
  blue: "BLU",
  red: "RED",
  green: "GRN",
  yellow: "YLW",
  purple: "PPL",
  pink: "PNK",
  silver: "SLV",
  grey: "GRY",
  gray: "GRY",
  gold: "GLD",
  orange: "ORG",
  clear: "CLR",
  small: "S",
  medium: "M",
  large: "L",
};

export function normalizeSkuPart(value: string | null | undefined) {
  return (value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeSku(value: string | null | undefined) {
  const normalized = normalizeSkuPart(value);
  return normalized || null;
}

export function normalizeBarcode(value: string | null | undefined) {
  const normalized = (value || "").replace(/\D/g, "");
  return normalized || null;
}

export function categoryCodeFromCategory(category: string) {
  const normalized = category.trim().toLowerCase().replace(/\s+/g, " ");
  if (CATEGORY_CODES[normalized]) return CATEGORY_CODES[normalized];

  const words = normalized.match(/[a-z0-9]+/g) || [];
  const initials = words
    .filter((word) => !["and", "for", "the", "of"].includes(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return initials || "GEN";
}

export function inferModelCode(name: string) {
  const text = name.toUpperCase();
  const version = text.match(/\bV\s*([0-9]+)\b/);
  if (version) return `V${version[1]}`;

  const dimension = text.match(/\bD\s*([0-9]+)\b/);
  if (dimension) return `D${dimension[1]}`;

  const size = text.match(/\b(XXL|XL|XS|S|M|L)\b/);
  if (size) return size[1];

  const model = text.match(/\b([A-Z]+[0-9]+|[0-9]+[A-Z]+)\b/);
  return model?.[1] ?? "";
}

export function variantCodeFromLabel(value: string | null | undefined) {
  const words = (value || "").toLowerCase().match(/[a-z0-9]+/g) || [];
  const codes = words
    .map((word) => VARIANT_CODES[word] || normalizeSkuPart(word))
    .filter(Boolean);

  return codes.join("-");
}

export function inferVariantCode(name: string) {
  const words = name.toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const word of words) {
    if (VARIANT_CODES[word]) return VARIANT_CODES[word];
  }
  return "";
}

export function generateSku(input: {
  category: string;
  name: string;
  model?: string | null;
  variant?: string | null;
}) {
  const category = categoryCodeFromCategory(input.category);
  const model = normalizeSkuPart(input.model) || inferModelCode(input.name) || "GEN";
  const variant =
    variantCodeFromLabel(input.variant) || inferVariantCode(input.name);

  return ["TS", category, model, variant].filter(Boolean).join("-");
}

export function isValidBarcode(value: string) {
  return /^\d{8,18}$/.test(value);
}
