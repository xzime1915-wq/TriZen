"use client";

import Image from "next/image";
import type { ProductColor } from "@/lib/product-data";
import { displayImageSrc } from "@/lib/image-path";
import { cn } from "@/lib/utils";

const SWATCH_FALLBACK: Record<string, string> = {
  black: "#171717",
  white: "#f4f4f5",
};

function swatchColor(name: string) {
  const key = name.trim().toLowerCase();
  if (key.includes("black")) return SWATCH_FALLBACK.black;
  if (key.includes("white")) return SWATCH_FALLBACK.white;
  return "#d4d4d8";
}

export function ProductColorPicker({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: ProductColor;
  onSelect: (color: ProductColor) => void;
}) {
  if (colors.length <= 1) return null;

  return (
    <div className="product-buy-swatches">
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => {
          const active = selected.name === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelect(c)}
              aria-label={c.name}
              aria-pressed={active}
              className={cn(
                "product-buy-swatch group relative shrink-0",
                active && "product-buy-swatch-active"
              )}
            >
              <span className="block h-11 w-11 overflow-hidden border border-[var(--color-border)] bg-white sm:h-12 sm:w-12">
                {c.image ? (
                  <Image
                    src={displayImageSrc(c.image)}
                    alt=""
                    width={96}
                    height={96}
                    unoptimized
                    className="h-full w-full object-contain object-center p-1"
                  />
                ) : (
                  <span
                    className="block h-full w-full"
                    style={{ backgroundColor: swatchColor(c.name) }}
                  />
                )}
              </span>
              <span className="sr-only">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
