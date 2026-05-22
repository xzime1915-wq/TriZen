import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";

type Props = {
  productSlug?: string;
};

function HeroCopy({ productSlug }: { productSlug: string }) {
  return (
    <>
      <p className="trizen-eyebrow trizen-fade-in">TriZen Store</p>
      <h1 className="trizen-headline trizen-metallic-light trizen-fade-in-delay-1 mt-4 text-3xl sm:text-5xl md:mt-5 md:text-[3.35rem] md:leading-[1.06]">
        TriPad
      </h1>
      <p className="trizen-fade-in-delay-2 mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:text-[11px] sm:tracking-[0.22em]">
        V1 in stock ·{" "}
        <Link
          href="/product/trizen-tripad-v2-black"
          className="text-zinc-300 hover:text-white transition"
        >
          V2 upcoming
        </Link>
      </p>
      <p className="trizen-fade-in-delay-2 mt-4 max-w-md text-sm leading-relaxed text-zinc-500 sm:mt-5 sm:text-base md:text-[0.9375rem]">
        Premium glass mouse pad — minimal design, maximum glide. Built for
        competitive esports in Bangladesh.
      </p>
      <div className="trizen-fade-in-delay-2 mt-6 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        <Link
          href={`/product/${productSlug}`}
          className="trizen-btn-primary w-full justify-center sm:w-auto sm:px-8 sm:py-3"
        >
          Shop TriPad
        </Link>
        <Link href="/shop" className="trizen-link-underline text-center sm:text-left">
          View collection →
        </Link>
      </div>
    </>
  );
}

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-black md:min-h-[100svh]">
      {/* ——— Mobile: text on top, product image below (no overlap) ——— */}
      <div className="flex flex-col md:hidden">
        <div className="container-trizen relative z-10 w-full min-w-0 pt-[4.5rem] pb-6">
          <HeroCopy productSlug={productSlug} />
        </div>
        <div className="relative h-[min(40svh,320px)] w-full shrink-0 bg-black">
          <Image
            src={HOME_HERO_IMAGE}
            alt="TriZen TriPad V1 black and white editions with gaming mouse"
            fill
            priority
            className="object-contain object-bottom px-2 pb-2"
            sizes="100vw"
            quality={90}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent"
            aria-hidden
          />
          <div className="trizen-hero-fade-bottom pointer-events-none" aria-hidden />
        </div>
        <p className="trizen-scroll-hint relative z-10 py-5 text-center">Scroll</p>
      </div>

      {/* ——— Desktop: image behind text ——— */}
      <div className="relative hidden min-h-[100svh] md:block">
        <div className="absolute inset-0 bg-black">
          <Image
            src={HOME_HERO_IMAGE}
            alt=""
            fill
            priority
            className="object-contain object-[72%_50%]"
            sizes="100vw"
            quality={95}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black via-black/80 via-30% to-transparent"
            aria-hidden
          />
          <div
            className="trizen-glow-orb pointer-events-none absolute left-0 top-1/3 h-80 w-96 -translate-y-1/2 opacity-80"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black via-black/40 to-transparent"
            aria-hidden
          />
          <div className="trizen-hero-fade-bottom-glow" aria-hidden />
          <div className="trizen-hero-fade-bottom" aria-hidden />
        </div>

        <div className="container-trizen relative z-10 flex min-h-[100svh] flex-col justify-center pb-16 pt-24">
          <div className="max-w-xl w-full min-w-0">
            <HeroCopy productSlug={productSlug} />
          </div>
        </div>

        <p className="trizen-scroll-hint absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          Scroll
        </p>
      </div>
    </section>
  );
}
