/** White logo — use on dark/black backgrounds */
export const LOGO_ON_DARK = "/logo.png";

/** Same asset as on-dark; TrizenLogo applies invert on light backgrounds */
export const LOGO_ON_LIGHT = "/logo.png";

export type LogoVariant = "on-dark" | "on-light";

export function getLogoSrc(variant: LogoVariant = "on-dark"): string {
  return variant === "on-light" ? LOGO_ON_LIGHT : LOGO_ON_DARK;
}
