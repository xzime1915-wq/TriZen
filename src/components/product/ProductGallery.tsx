"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/components/ProductImage";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
  showGlideBackground?: boolean;
}) {
  const [active, setActive] = useState(images[0] || "");

  if (!active) return null;

  return (
    <div className="w-full min-w-0">
      {/* Large hero image — no border box, soft gray backdrop (reference-style) */}
      <div className="relative w-full overflow-hidden bg-zinc-100 min-h-[min(92vw,520px)] sm:min-h-[560px] lg:min-h-[min(72vh,720px)] lg:max-h-[min(82vh,820px)]">
        <div className="absolute inset-0 sm:inset-[1%] lg:inset-[0.5%]">
          <ProductImage
            src={active}
            alt={productName}
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="!p-0 object-contain object-center"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="mt-4 lg:mt-6">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
            More photos
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(src)}
                className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-zinc-100 transition sm:h-20 sm:w-20 ${
                  active === src
                    ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-white"
                    : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View photo ${i + 1}`}
                aria-current={active === src ? "true" : undefined}
              >
                <Image
                  src={src}
                  alt=""
                  width={160}
                  height={160}
                  unoptimized
                  className="h-full w-full object-contain object-center p-1"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
