import Image from "next/image";
import Link from "next/link";
import { HOME_HERO_IMAGE } from "@/lib/home-assets";
type Props = {
  productSlug?: string;
};

export function HomeMinimalHero({ productSlug = "trizen-tripad-v1-black" }: Props) {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black">
        <Image
          src={HOME_HERO_IMAGE}
          alt="TriZen TriPad V1 black and white editions with gaming mouse"
          fill
          priority
          className="object-contain object-[85%_50%] sm:object-[78%_50%] md:object-[72%_50%]"
          sizes="100vw"
          quality={95}
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

      <div className="container-trizen relative z-10 flex min-h-[100svh] flex-col justify-center pt-[4.25rem] pb-14 md:pt-24 md:pb-16">
        <div className="max-w-xl w-full min-w-0">
          <p className="trizen-eyebrow trizen-fade-in">TriZen Store</p>
          <h1 className="trizen-headline trizen-metallic-light trizen-fade-in-delay-1 mt-5 text-3xl sm:text-5xl md:text-[3.35rem] md:leading-[1.06]">
            TriPad
          </h1>
          <p className="trizen-fade-in-delay-2 mt-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            V1 in stock ·{" "}
            <Link
              href="/product/trizen-tripad-v2-black"
              className="text-zinc-300 hover:text-white transition"
            >
              V2 upcoming
            </Link>
          </p>
          <p className="trizen-body trizen-fade-in-delay-2 mt-5 max-w-md md:text-[0.9375rem]">
            Premium glass mouse pad — minimal design, maximum glide. Built for
            competitive esports in Bangladesh.
          </p>
          <div className="trizen-fade-in-delay-2 mt-9 flex flex-wrap items-center gap-5 sm:gap-6">
            <Link href={`/product/${productSlug}`} className="trizen-btn-primary px-8 py-3">
              Shop TriPad
            </Link>
            <Link href="/shop" className="trizen-link-underline">
              View collection →
            </Link>
          </div>
        </div>
      </div>

      <p className="trizen-scroll-hint absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
        Scroll
      </p>
    </section>
  );
}
