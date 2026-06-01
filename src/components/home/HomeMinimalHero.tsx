import Link from "next/link";
import { HeroProductVisual } from "@/components/home/HeroProductVisual";

type Props = {
  productSlug?: string;
};

function HeroCopy({ productSlug }: { productSlug: string }) {
  return (
    <div className="flex w-full max-w-xl flex-col items-start">
      <h1 className="trizen-headline trizen-fade-in text-[clamp(0.6rem,2.7vw,1.05rem)] leading-[1.12] tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">
        Maximum glide for only pros.
      </h1>

      <div className="trizen-fade-in-delay-1 mt-3 sm:mt-8 md:mt-10">
        <Link
          href={`/product/${productSlug}`}
          className="trizen-btn-primary whitespace-nowrap max-md:!px-[clamp(9px,3vw,18px)] max-md:!py-[clamp(5px,1.6vw,10px)] max-md:!text-[clamp(7px,2.1vw,12px)] max-md:!tracking-[0.12em] sm:!px-10 sm:!py-4 sm:text-sm md:!px-12 md:!py-5 md:text-base"
        >
          Shop TriPad
        </Link>
      </div>
    </div>
  );
}

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate overflow-x-clip border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-trizen relative">
        <div className="grid grid-cols-2 items-center gap-3 py-10 sm:gap-8 sm:py-12 md:min-h-[calc(100dvh-4rem)] md:gap-10 lg:gap-14 md:py-14 lg:py-16">
          <div className="relative z-10 flex flex-col justify-center md:max-w-lg md:pr-4 lg:pr-8">
            <HeroCopy productSlug={productSlug} />
          </div>

          <div className="relative z-0 w-full max-w-[min(100%,520px)] md:max-w-none md:justify-self-end">
            <HeroProductVisual />
          </div>
        </div>
      </div>

      <p className="trizen-scroll-hint absolute bottom-3 left-1/2 z-10 -translate-x-1/2 sm:bottom-6">
        Scroll
      </p>
    </section>
  );
}
