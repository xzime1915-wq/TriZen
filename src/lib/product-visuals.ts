/** TRIPAD showcases that use the glide lifestyle background image. */
export function usesTripadGlideBackground(slug: string): boolean {
  return slug.includes("tripad");
}

/** Home featured: pad on top, glide action image below. */
export function usesTripadGlideBackgroundOnHome(slug: string): boolean {
  return usesTripadGlideBackground(slug);
}
