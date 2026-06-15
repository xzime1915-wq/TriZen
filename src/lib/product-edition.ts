import { TRIPAD_MODEL_NAMES } from "@/lib/product-catalog-content";

export function editionLabelFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("black")) return "Black";
  if (lower.includes("white")) return "White";
  if (lower.includes("silver")) return "Silver";
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

export function baseNameFromProductName(name: string): string {
  return normalizeTripadDisplayName(
    name
      .replace(/\s+(black|white|silver)$/i, "")
      .trim(),
  );
}

/** Map legacy DB / cart names to TP-V1 / TP-V2 display labels. */
export function normalizeTripadDisplayName(name: string): string {
  const lower = name.toLowerCase();

  if (
    lower.includes("v1") &&
    (lower.includes("black") || lower.includes("(black)"))
  ) {
    return TRIPAD_MODEL_NAMES.v1Black;
  }
  if (
    lower.includes("v1") &&
    (lower.includes("white") || lower.includes("(white)"))
  ) {
    return TRIPAD_MODEL_NAMES.v1White;
  }
  if (
    lower.includes("v2") &&
    (lower.includes("black") || lower.includes("(black)"))
  ) {
    return TRIPAD_MODEL_NAMES.v2Black;
  }
  if (
    lower.includes("v2") &&
    (lower.includes("white") || lower.includes("(white)"))
  ) {
    return TRIPAD_MODEL_NAMES.v2White;
  }

  return name.trim();
}

export function cartItemDisplayName(item: {
  name: string;
  baseName?: string;
}): string {
  const raw = item.baseName ?? item.name.split(/, | — /)[0] ?? item.name;
  return normalizeTripadDisplayName(raw);
}
