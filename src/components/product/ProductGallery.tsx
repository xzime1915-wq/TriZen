"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductVisualFrame } from "@/components/product/ProductVisualFrame";
import { getLargeProductImageScale } from "@/lib/product-visual-scale";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
  showGlideBackground?: boolean;
}) {
  const [active, setActive] = useState(images[0] || "");
  const activeScale = getLargeProductImageScale(active);

  if (!active) return null;

  return (
    <div className="w-full min-w-0">
      <ProductVisualFrame
        src={active}
        alt={productName}
        priority
        variant="large"
        sizes="(max-width: 1024px) 100vw, 62vw"
        imageScale={activeScale}
      />

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
                className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-transparent transition sm:h-20 sm:w-20 ${
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
