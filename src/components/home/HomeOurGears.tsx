"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OUR_GEARS, OUR_GEARS_FALLBACK_IMAGES, type OurGearCard } from "@/lib/our-gears";
import { cn } from "@/lib/utils";

function GearCardMark() {
  return (
    <span
      className="our-gear-card-mark block h-3.5 w-3.5 shrink-0 border border-white/30"
      aria-hidden
    />
  );
}

function GearCard({ gear }: { gear: OurGearCard }) {
  const [imgSrc, setImgSrc] = useState(gear.image);
  const titleLine2 = gear.titleLine2.trim();

  return (
    <Link
      href={gear.href}
      className={cn(
        "our-gear-card group relative block aspect-[9/16] w-[78vw] max-w-[280px] shrink-0 snap-center overflow-hidden",
        "min-h-[400px] max-h-[520px] border border-[var(--color-border)] bg-[var(--color-surface)]",
        "transition-colors duration-300 hover:border-zinc-600",
        "sm:min-h-[440px] md:min-h-[480px] md:max-h-none md:w-full md:max-w-none"
      )}
    >
      <Image
        src={imgSrc}
        alt={`${gear.titleLine1} ${gear.titleLine2}`.trim()}
        fill
        unoptimized
        priority={gear.id === "glass-mouse-pad"}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 78vw, 25vw"
        onError={() => {
          const fallback = OUR_GEARS_FALLBACK_IMAGES[gear.id];
          if (fallback && imgSrc !== fallback) setImgSrc(fallback);
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 from-0% via-black/15 via-45% to-black/90 to-100%"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_40%_at_50%_100%,rgba(0,0,0,0.55)_0%,transparent_70%)]"
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-4 md:px-5 md:pt-5">
        <span className="text-[9px] font-medium uppercase tracking-[0.38em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
          Trizen
        </span>
        <GearCardMark />
      </div>

      <div className="absolute inset-x-0 top-12 z-10 px-4 md:top-14 md:px-5">
        <h3 className="text-[1.25rem] font-bold uppercase leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-[1.35rem] md:text-2xl">
          {gear.titleLine1}
          {titleLine2 ? (
            <>
              <br />
              {titleLine2}
            </>
          ) : null}
        </h3>
        <p
          className={cn(
            "mt-2 text-[10px] font-bold uppercase tracking-[0.32em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]",
            "text-amber-400"
          )}
        >
          {gear.statusLabel}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 space-y-0.5 px-4 pb-5 md:px-5 md:pb-6">
        <p className="text-[9px] uppercase tracking-[0.24em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] sm:text-[10px]">
          {gear.taglineLine1}
        </p>
        <p className="text-[9px] uppercase tracking-[0.24em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] sm:text-[10px]">
          {gear.taglineLine2}
        </p>
      </div>
    </Link>
  );
}

export function HomeOurGears() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(255,255,255,0.03)_0%,transparent_60%)]"
        aria-hidden
      />
      <div className="container-trizen relative py-10 md:py-24 lg:py-28">
        <div className="mb-6 text-center md:mb-14 md:text-left">
          <p className="trizen-eyebrow mb-2 text-[8px] tracking-[0.28em] md:mb-4 md:text-xs">
            Catalog
          </p>
          <h2 className="trizen-headline text-[1.15rem] leading-tight md:text-4xl">
            Our Gears
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[0.7rem] leading-[1.55] text-zinc-500 md:mx-0 md:mt-4 md:max-w-xl md:text-base md:leading-relaxed">
            The full TriZen lineup — glass pads, soft pads, skates, and sleeves built
            for competitive play.
          </p>
        </div>

        <div className="-mx-4 flex items-stretch gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-3 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {OUR_GEARS.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      </div>
    </section>
  );
}
