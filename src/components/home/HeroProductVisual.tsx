import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_SIZES,
  HOME_HERO_IMAGE_SRC_SET,
} from "@/lib/home-assets";

/** Home hero — transparent TRIPAD stack (WebP, alpha preserved). */
export function HeroProductVisual() {
  return (
    <div className="hero-product-visual relative mx-auto w-full max-w-[min(100%,22rem)] bg-transparent sm:max-w-md md:ml-auto md:max-w-lg lg:max-w-xl">
      <div className="relative aspect-[16/11] w-full bg-transparent md:aspect-[5/4] md:max-h-[min(42vh,400px)] lg:max-h-[min(46vh,440px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HOME_HERO_IMAGE}
          srcSet={HOME_HERO_IMAGE_SRC_SET}
          sizes={HOME_HERO_IMAGE_SIZES}
          alt="TRIZEN TRIPAD V1 glass mouse pads with gaming mouse"
          className="h-full w-full bg-transparent object-contain object-center"
          width={3840}
          height={2160}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
