"use client";

import type { ProductColor } from "@/lib/product-data";

export function ProductColorPicker({
  colors,
  selected,
  onSelect,
}: {
  colors: ProductColor[];
  selected: ProductColor;
  onSelect: (color: ProductColor) => void;
}) {
  if (colors.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-sm mb-3">
        <span className="text-[var(--color-muted)]">Option: </span>
        <span className="font-medium">{selected.name}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onSelect(c)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider border transition ${
              selected.name === c.name
                ? "border-white bg-white text-black"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-zinc-500 hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
