/** White logo — use on dark/black backgrounds */
export const LOGO_ON_DARK = "/trizen-icon.png";

/** Black logo on transparent — use on light backgrounds (no invert needed) */
export const LOGO_ON_LIGHT = "/logo_b.png";

export type LogoVariant = "on-dark" | "on-light";

export function getLogoSrc(variant: LogoVariant = "on-dark"): string {
  return variant === "on-light" ? LOGO_ON_LIGHT : LOGO_ON_DARK;
}
