import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";

type Props = {
  productSlug?: string;
};

function HeroCopy({ productSlug }: { productSlug: string }) {
  return (
    <div className="flex w-full max-w-[15.5rem] flex-col items-start sm:max-w-[17rem] md:max-w-xs">
      <p className="trizen-fade-in max-w-[18rem] text-[11px] uppercase leading-snug tracking-[0.1em] text-zinc-300 antialiased sm:text-[13px] sm:tracking-[0.12em] md:text-sm">
        Maximum glide for only pros.
      </p>

      <div className="trizen-fade-in-delay-1 mt-6 sm:mt-7">
        <Link
          href={`/product/${productSlug}`}
          className="trizen-btn-primary !px-6 !py-2.5 text-[10px] leading-none tracking-[0.18em] sm:!px-8 sm:!py-3 sm:text-xs"
        >
          Shop TriPad
        </Link>
      </div>
    </div>
  );
}

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden bg-black">
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

      <div className="container-trizen relative z-10 min-h-[calc(100dvh-4rem)] pb-14">
        <div className="absolute inset-x-0 top-[34%] -translate-y-1/2 px-4 md:static md:inset-auto md:top-auto md:flex md:min-h-[calc(100dvh-4rem)] md:translate-y-0 md:items-center md:px-0">
          <HeroCopy productSlug={productSlug} />
        </div>
      </div>

      <p className="trizen-scroll-hint absolute bottom-5 left-1/2 z-10 -translate-x-1/2 sm:bottom-6">
        Scroll
      </p>
    </section>
  );
}
