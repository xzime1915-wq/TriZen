export type ProductColor = { name: string; image?: string };
export type ProductSpec = { label: string; value: string };

/** Marketing banners — description slideshow only, never product gallery */
export const TRIPAD_DESCRIPTION_SLIDES = [
  "/products/tripad-3mm-feature.png",
  "/products/tripad-scratch-proof.png",
  "/products/tripad-anti-slip-base.png",
] as const;

const DESCRIPTION_ONLY_IMAGES = new Set<string>(TRIPAD_DESCRIPTION_SLIDES);

export function isTripadProduct(slug?: string, name?: string): boolean {
  const label = `${slug || ""} ${name || ""}`.toLowerCase();
  return label.includes("tripad") || label.includes("tri pad");
}

export function getTripadDescriptionSlides(slug?: string, name?: string): string[] {
  return isTripadProduct(slug, name) ? [...TRIPAD_DESCRIPTION_SLIDES] : [];
}

function stripDescriptionOnlyImages(urls: string[]): string[] {
  return urls.filter((src) => !DESCRIPTION_ONLY_IMAGES.has(src));
}

export function parseJsonField<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJsonField(value: unknown): string {
  return JSON.stringify(value);
}

export function parseFeatures(raw: string): string[] {
  return parseJsonField<string[]>(raw, []).filter(Boolean);
}

export function parseSpecs(raw: string): ProductSpec[] {
  return parseJsonField<ProductSpec[]>(raw, []).filter((s) => s.label && s.value);
}

export function parseGallery(
  raw: string,
  mainImage: string,
  opts?: { slug?: string; name?: string }
): string[] {
  let list = parseJsonField<string[]>(raw, []).filter(Boolean);

  const label = `${opts?.slug || ""} ${opts?.name || ""}`.toLowerCase();
  if (label.includes("tripad") || label.includes("tri pad")) {
    const isWhite = label.includes("white");
    const isBlack = label.includes("black");
    if (isWhite || isBlack) {
      list = list.filter((src) => {
        const s = src.toLowerCase();
        if (isWhite && s.includes("black")) return false;
        if (isBlack && s.includes("white")) return false;
        return true;
      });
    }
  }

  let merged = [...list];
  if (mainImage && !merged.includes(mainImage)) merged.unshift(mainImage);
  if (merged.length === 0 && mainImage) merged = [mainImage];

  return stripDescriptionOnlyImages(merged);
}

/** Color names for checkout only — not used in the photo gallery */
export function parseColors(raw: string): ProductColor[] {
  return parseJsonField<ProductColor[]>(raw, [])
    .map((c) => ({ name: c.name?.trim(), image: c.image?.trim() || undefined }))
    .filter((c) => c.name && c.name.toLowerCase() !== "default");
}

/** Admin textarea: one feature per line */
export function featuresFromLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Admin textarea: Label | Value or Label: Value */
export function specsFromLines(text: string): ProductSpec[] {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const pipe = trimmed.split("|");
      if (pipe.length >= 2) {
        return { label: pipe[0].trim(), value: pipe.slice(1).join("|").trim() };
      }
      const colon = trimmed.indexOf(":");
      if (colon > 0) {
        return {
          label: trimmed.slice(0, colon).trim(),
          value: trimmed.slice(colon + 1).trim(),
        };
      }
      return null;
    })
    .filter((s): s is ProductSpec => s !== null);
}

/** Admin textarea: one image path per line */
export function galleryFromLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Admin textarea: one option name per line (optional legacy: Name | image) */
export function colorsFromLines(text: string): ProductColor[] {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const parts = trimmed.split("|");
      if (parts.length >= 2) {
        const image = parts.slice(1).join("|").trim();
        return {
          name: parts[0].trim(),
          ...(image ? { image } : {}),
        };
      }
      return { name: trimmed };
    })
    .filter((c): c is ProductColor => c !== null && !!c.name);
}

export function featuresToLines(features: string[]): string {
  return features.join("\n");
}

export function specsToLines(specs: ProductSpec[]): string {
  return specs.map((s) => `${s.label} | ${s.value}`).join("\n");
}

export function galleryToLines(images: string[]): string {
  return images.join("\n");
}

export function colorsToLines(colors: ProductColor[]): string {
  return colors.map((c) => c.name).join("\n");
}

export function averageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
