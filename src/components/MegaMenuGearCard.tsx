"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { OUR_GEARS_FALLBACK_IMAGES, type OurGearCard } from "@/lib/our-gears";

type Props = {
  gear: OurGearCard;
  onNavigate?: () => void;
  priority?: boolean;
};

export function MegaMenuGearCard({ gear, onNavigate, priority }: Props) {
  const [imgSrc, setImgSrc] = useState(displayImageSrc(gear.image));
  const title = `${gear.titleLine1} ${gear.titleLine2}`.trim();

  return (
    <Link
      href={gear.href}
      onClick={onNavigate}
      className="trizen-mega-gear-item group block"
    >
      <div className="trizen-mega-gear-media">
        <Image
          src={imgSrc}
          alt={title}
          fill
          priority={priority}
          quality={IMAGE_QUALITY}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="192px"
          onError={() => {
            const fallback = OUR_GEARS_FALLBACK_IMAGES[gear.id];
            if (fallback) {
              const resolved = displayImageSrc(fallback);
              if (imgSrc !== resolved) setImgSrc(resolved);
            }
          }}
        />
      </div>
      <div className="trizen-mega-gear-copy">
        <span className="trizen-mega-gear-eyebrow">{gear.statusLabel}</span>
        <h3 className="trizen-mega-gear-title">{title}</h3>
        <p className="trizen-mega-gear-desc">
          {gear.taglineLine1} {gear.taglineLine2}
        </p>
      </div>
    </Link>
  );
}
