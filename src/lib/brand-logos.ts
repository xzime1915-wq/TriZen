/** White logo — use on dark/black backgrounds */
export const LOGO_ON_DARK = "/logo.png";

/** Black logo — use on white/light backgrounds */
export const LOGO_ON_LIGHT = "/logo_b.png";

export type LogoVariant = "on-dark" | "on-light";

export function getLogoSrc(variant: LogoVariant = "on-dark"): string {
  return variant === "on-light" ? LOGO_ON_LIGHT : LOGO_ON_DARK;
}
