export function editionLabelFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("black")) return "Black";
  if (lower.includes("white")) return "White";
  if (lower.includes("silver")) return "Silver";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

export function baseNameFromProductName(name: string): string {
  return name
    .replace(/\s*\([^)]+\)\s*$/i, "")
    .replace(/\s+(black|white|silver)$/i, "")
    .trim();
}

/** SKU or catalog model name for checkout edition picker. */
const TRIPAD_SKU_BY_SLUG: Record<string, string> = {
  "trizen-tripad-v1-black": "TZ TRIPAD V1 BLK",
  "trizen-tripad-v1-white": "TZ TRIPAD V1 WHT",
  "trizen-tripad-v2-black": "TZ TRIPAD V2 BLK",
  "trizen-tripad-v2-white": "TZ TRIPAD V2 WHT",
};

export function modelLabelFromProduct(
  name: string,
  sku?: string | null,
  slug?: string | null
): string {
  if (sku?.trim()) return sku.trim();
  if (slug) {
    const fromSlug = TRIPAD_SKU_BY_SLUG[slug.trim().toLowerCase()];
    if (fromSlug) return fromSlug;
  }
  const trimmed = name.trim();
  if (/^TP\s*-/i.test(trimmed)) return trimmed;
  return editionLabelFromName(name);
}

/** Short product line title on checkout (without edition suffix). */
export function checkoutProductTitle(name: string): string {
  const trimmed = name.trim();
  const tpMatch = trimmed.match(/^(TP\s*-\s*V\d+)/i);
  if (tpMatch) return tpMatch[1].replace(/\s+/g, " ");
  return baseNameFromProductName(trimmed);
}
