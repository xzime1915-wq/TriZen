import Link from "next/link";
import { HeroProductVisual } from "@/components/home/HeroProductVisual";

type Props = {
  productSlug?: string;
};

function HeroCopy({ productSlug }: { productSlug: string }) {
  return (
    <div className="flex w-full max-w-xl flex-col items-start">
      <h1
        aria-label="Maximum glide for only pros"
        className="home-hero-title trizen-wh-section-title text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.05] md:text-6xl lg:text-7xl"
      >
        Maximum glide for only pr
        <span className="home-hero-letter-hollow">o</span>s
      </h1>

      <div className="mt-8 sm:mt-10">
        <Link href={`/product/${productSlug}`} className="trizen-wh-ghost-btn">
          Shop TRIPAD
        </Link>
      </div>
    </div>
  );
}

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate overflow-x-clip bg-white">
      <div className="container-trizen relative">
        <div className="grid grid-cols-2 items-center gap-4 py-12 sm:gap-8 sm:py-16 md:min-h-[calc(100dvh-4rem)] md:gap-12 lg:gap-16 md:py-20">
          <div className="relative z-10 flex flex-col justify-center md:max-w-lg md:pr-4 lg:pr-10">
            <HeroCopy productSlug={productSlug} />
          </div>

          <div className="relative z-0 w-full md:justify-self-end">
            <HeroProductVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
