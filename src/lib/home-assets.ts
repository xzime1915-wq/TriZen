/** Home hero — transparent TRIPAD (export WebP from public/products/trizen-tripad-hero.png) */
export const HOME_HERO_IMAGE = "/products/trizen-tripad-hero.webp";
export const HOME_HERO_IMAGE_TABLET = "/products/trizen-tripad-hero-2560.webp";
export const HOME_HERO_IMAGE_MOBILE = "/products/trizen-tripad-hero-1280.webp";

/** Retina-aware srcSet — 1280 / 2560 / 3840 from 6000px master */
export const HOME_HERO_IMAGE_SRC_SET = `${HOME_HERO_IMAGE_MOBILE} 1280w, ${HOME_HERO_IMAGE_TABLET} 2560w, ${HOME_HERO_IMAGE} 3840w`;

/** Hero sits in ~half the grid on desktop — request enough pixels for 2x DPR */
export const HOME_HERO_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 48vw, (min-width: 1536px) 42vw, 50vw";
export const HOME_GLIDE_IMAGE = "/products/engineered-glide.webp";
/** Glide → Choose edition — Ultimate Esports banner (user asset) */
export const HOME_GLIDE_BRIDGE_IMAGE = "/products/trizen-ultimate-esports.webp";
export const HOME_GLIDE_TRIPAD_IMAGE = "/products/tripad-v1-duo.webp";
export const HOME_GLIDE_WHITE_IMAGE = "/products/tripad-v1-white.webp";
export const HOME_GLIDE_BLACK_IMAGE = "/products/tripad-v1-black.webp";
/** V2 showcase — duo shot (WebP for fast load; PNG: tripad-v2-duo.png) */
export const HOME_GLIDE_V2_TRIPAD_IMAGE = "/products/tripad-v2-duo.webp";
export const HOME_GLIDE_V2_BLACK_IMAGE = "/products/tripad-v2-black.webp";
export const HOME_GLIDE_V2_WHITE_IMAGE = "/products/tripad-v2-white.webp";
