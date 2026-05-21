"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";
import { ProductGlideBackground } from "./ProductGlideBackground";

export function ProductGallery({
  images,
  productName,
  showGlideBackground = false,
}: {
  images: string[];
  productName: string;
  showGlideBackground?: boolean;
}) {
  const [active, setActive] = useState(images[0] || "");

  if (!active) return null;

  return (
    <div>
      <div className="relative aspect-square min-h-[320px] overflow-hidden mb-3">
        {showGlideBackground && <ProductGlideBackground />}
        <div className="relative z-10 h-full min-h-[320px] w-full">
          <ProductImage
            src={active}
            alt={productName}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={
              showGlideBackground
                ? "p-6 sm:p-10 object-contain object-top pb-20"
                : "p-0 sm:p-2 object-contain"
            }
          />
        </div>
      </div>

      {images.length > 1 && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-2">
            More photos
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(src)}
                className={`relative h-20 w-20 shrink-0 border bg-black transition ${
                  active === src
                    ? "border-white ring-1 ring-white"
                    : "border-[var(--color-border)] hover:border-zinc-500"
                }`}
                aria-label={`View photo ${i + 1}`}
              >
                <ProductImage src={src} alt="" sizes="80px" className="p-2" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
