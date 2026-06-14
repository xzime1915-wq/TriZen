"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { OurGearCta } from "@/components/OurGearCta";
import { OUR_GEARS_FALLBACK_IMAGES, type OurGearCard } from "@/lib/our-gears";

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
  const title = `${gear.titleLine1} ${gear.titleLine2}`.trim();

  return (
    <Link href={gear.href} onClick={onNavigate} className="our-gear-card group block">
      <div className="our-gear-card-visual">
        <Image
          src={imgSrc}
          alt={title}
          fill
          priority={priority ?? gear.id === "glass-mouse-pad"}
          quality={IMAGE_QUALITY}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 50vw, 25vw"
          onError={() => {
            const fallback = OUR_GEARS_FALLBACK_IMAGES[gear.id];
            if (fallback) {
              const resolved = displayImageSrc(fallback);
              if (imgSrc !== resolved) setImgSrc(resolved);
            }
          }}
        />

        <div className="our-gear-card-overlay" aria-hidden />

        <div className="our-gear-card-meta">
          <h3 className="our-gear-card-title">
            <span>{gear.titleLine1}</span>
            {gear.titleLine2 ? <span>{gear.titleLine2}</span> : null}
          </h3>
          <p className="our-gear-card-tagline">
            <span>{gear.taglineLine1}</span>
            <span>{gear.taglineLine2}</span>
          </p>
          <OurGearCta
            label={gear.statusLabel}
            muted={gear.status !== "grab"}
          />
        </div>
      </div>
    </Link>
  );
}
