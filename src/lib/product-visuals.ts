/** TriPad showcases that use the glide lifestyle background image. */
export function usesTripadGlideBackground(slug: string): boolean {
  return slug.includes("tripad");
}

/** Home featured: duo hero for V1 black — no extra glide layer. */
export function usesTripadGlideBackgroundOnHome(slug: string): boolean {
  return usesTripadGlideBackground(slug) && slug !== "trizen-tripad-v1-black";
}
