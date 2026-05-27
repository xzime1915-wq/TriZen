import Image from "next/image";
import Link from "next/link";
import { GlideAnimatedTitle } from "@/components/home/GlideAnimatedTitle";
import { GlideEditionBridge } from "@/components/home/GlideEditionBridge";
import {
  EditionShowcaseV1,
  EditionShowcaseV2,
} from "@/components/home/EditionShowcase";
import { HOME_GLIDE_IMAGE } from "@/lib/home-assets";

function GlideActionBanner() {
  return (
    <div className="relative min-h-[40vh] sm:min-h-[44vh] md:min-h-[58vh] overflow-hidden bg-[var(--color-surface)]">
      <Image
        src={HOME_GLIDE_IMAGE}
        alt="Mouse gliding at speed on TriZen glass surface"
        fill
        unoptimized
        className="object-cover object-center opacity-95"
        sizes="100vw"
        quality={90}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-[var(--color-surface)] via-[var(--color-surface)]/50 to-transparent sm:h-32"
        aria-hidden
      />

      <div className="container-trizen relative z-10 flex min-h-[40vh] sm:min-h-[44vh] md:min-h-[58vh] items-end justify-center px-4 pb-7 sm:pb-8 md:px-0 md:pb-16">
        <div className="glide-performance-block max-w-2xl w-full text-center text-white">
          <p className="glide-performance-eyebrow text-[10px] uppercase tracking-[0.38em] text-white">
            Performance
          </p>
          <GlideAnimatedTitle className="glide-performance-title !text-white" />
          <p className="glide-performance-body mx-auto max-w-lg text-center text-zinc-400 md:mt-4 md:text-base md:leading-relaxed">
            Low-friction glass helps your mouse move freely while the pad stays
            planted — built for ranked play and long sessions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function HomeGlideFeature() {
  return (
    <section className="overflow-x-clip bg-[var(--color-surface)]">
      <GlideActionBanner />
      <div className="relative bg-[var(--color-surface)] pt-12 sm:pt-16 md:pt-20">
        <GlideEditionBridge />
      </div>

      <div className="relative bg-white pb-12 max-md:pb-10 md:pb-20">
        <EditionShowcaseV1 />
        <EditionShowcaseV2 />
      </div>
    </section>
  );
}
