import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";

type Props = {
  productSlug?: string;
};

function HeroCopy({ productSlug }: { productSlug: string }) {
  return (
    <div className="flex w-full max-w-[18rem] flex-col items-start sm:max-w-md md:max-w-lg">
      <h1 className="trizen-headline trizen-fade-in max-w-[16rem] text-xl leading-[1.15] sm:max-w-none sm:text-2xl md:text-3xl lg:text-4xl">
        Maximum glide for only pros.
      </h1>

      <div className="trizen-fade-in-delay-1 mt-6 sm:mt-10">
        <Link
          href={`/product/${productSlug}`}
          className="trizen-btn-primary !px-8 !py-3.5 text-xs tracking-[0.2em] sm:!px-10 sm:!py-4 sm:text-sm md:!px-12 md:!py-5 md:text-base"
        >
          Shop TriPad
        </Link>
      </div>
    </div>
  );
}

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate min-h-[62dvh] sm:min-h-[72dvh] md:min-h-[calc(100dvh-4rem)] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black">
        <Image
          src={HOME_HERO_IMAGE}
          alt="TriZen TriPad V1 black and white editions with gaming mouse"
          fill
          priority
          className="object-contain object-right-top md:object-[72%_50%]"
          sizes="100vw"
          quality={95}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black from-0% via-black/92 via-[38%] to-transparent to-100% sm:via-black/85 sm:via-35% md:via-30%"
          aria-hidden
        />
        <div
          className="trizen-glow-orb pointer-events-none absolute left-0 top-1/2 hidden h-80 w-96 -translate-y-1/2 opacity-80 md:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black via-black/50 to-transparent sm:h-28"
          aria-hidden
        />
        <div className="trizen-hero-fade-bottom-glow" aria-hidden />
        <div className="trizen-hero-fade-bottom" aria-hidden />
      </div>

      <div className="container-trizen relative z-10 flex min-h-[62dvh] flex-col justify-center pb-8 sm:min-h-[72dvh] sm:pb-10 md:min-h-[calc(100dvh-4rem)] md:pb-14">
        <div className="px-4 md:absolute md:inset-x-0 md:top-[34%] md:-translate-y-1/2 md:px-0">
          <HeroCopy productSlug={productSlug} />
        </div>
      </div>

      <p className="trizen-scroll-hint absolute bottom-3 left-1/2 z-10 -translate-x-1/2 sm:bottom-6">
        Scroll
      </p>
    </section>
  );
}
