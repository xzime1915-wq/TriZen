"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TrizenBrandName } from "@/components/TrizenBrandName";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { OUR_GEARS_FALLBACK_IMAGES, type OurGearCard } from "@/lib/our-gears";
import { cn } from "@/lib/utils";

function GearCardMark() {
  return (
    <span
      className="our-gear-card-mark block h-3.5 w-3.5 shrink-0 border border-zinc-900/30"
      aria-hidden
    />
  );
}

type Props = {
  gear: OurGearCard;
  onNavigate?: () => void;
  priority?: boolean;
};

export function OurGearCardLink({
  gear,
  onNavigate,
  priority,
}: Props) {
  const [imgSrc, setImgSrc] = useState(displayImageSrc(gear.image));
  const titleLine2 = gear.titleLine2.trim();

  return (
    <Link
      href={gear.href}
      onClick={onNavigate}
      className={cn(
        "our-gear-card group relative block aspect-[9/16] w-full overflow-hidden",
        "border border-[var(--color-border)] bg-[var(--color-surface)]",
        "transition-colors duration-300 hover:border-zinc-600",
        "md:min-h-[480px] md:max-h-none",
      )}
    >
      <Image
        src={imgSrc}
        alt={`${gear.titleLine1} ${gear.titleLine2}`.trim()}
        fill
        quality={IMAGE_QUALITY}
        priority={priority ?? gear.id === "glass-mouse-pad"}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 78vw, 25vw"
        onError={() => {
          const fallback = OUR_GEARS_FALLBACK_IMAGES[gear.id];
          if (fallback) {
            const resolved = displayImageSrc(fallback);
            if (imgSrc !== resolved) setImgSrc(resolved);
          }
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

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-3 pt-3 md:px-5 md:pt-5">
        <TrizenBrandName className="text-[8px] tracking-[0.3em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] sm:text-[9px] sm:tracking-[0.38em]" />
        <GearCardMark />
      </div>

      <div className="absolute inset-x-0 top-9 z-10 px-3 sm:top-12 md:top-14 md:px-5">
        <h3 className="text-[0.95rem] font-bold uppercase leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:text-[1.35rem] md:text-2xl">
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
            "mt-1.5 text-[8px] font-bold uppercase tracking-[0.24em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:mt-2 sm:text-[10px] sm:tracking-[0.32em]",
            "text-amber-400",
          )}
        >
          {gear.statusLabel}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 space-y-0.5 px-3 pb-4 md:px-5 md:pb-6">
        <p className="text-[8px] uppercase tracking-[0.18em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] sm:text-[10px] sm:tracking-[0.24em]">
          {gear.taglineLine1}
        </p>
        <p className="text-[8px] uppercase tracking-[0.18em] text-white/85 drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] sm:text-[10px] sm:tracking-[0.24em]">
          {gear.taglineLine2}
        </p>
      </div>
    </Link>
  );
}
