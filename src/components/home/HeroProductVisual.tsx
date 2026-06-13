import {
  HOME_HERO_IMAGE,
  HOME_HERO_IMAGE_SIZES,
  HOME_HERO_IMAGE_SRC_SET,
} from "@/lib/home-assets";

/** Home hero — transparent TRIPAD stack (WebP, alpha preserved). */
export function HeroProductVisual() {
  return (
    <div className="relative w-full bg-transparent">
      <div className="relative aspect-[16/10] w-full bg-transparent sm:aspect-[16/11] md:aspect-[16/10] md:max-h-[min(68vh,560px)] lg:max-h-[min(72vh,620px)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HOME_HERO_IMAGE}
          srcSet={HOME_HERO_IMAGE_SRC_SET}
          sizes={HOME_HERO_IMAGE_SIZES}
          alt="TRIZEN TRIPAD V1 glass mouse pads with gaming mouse"
          className="h-full w-full bg-transparent object-contain object-center md:object-right"
          width={3840}
          height={2160}
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </div>
  );
}
