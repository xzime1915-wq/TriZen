"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { SHOP_GEAR_COPY, SHOP_GEAR_ORDER, isShopGearLine } from "@/lib/shop-gears";

export function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const activeGear = searchParams.get("gear");

  function updateParams(updates: { gear?: string | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    if (updates.gear === null) params.delete("gear");
    else if (updates.gear) params.set("gear", updates.gear);
    if (updates.q === null) params.delete("q");
    else if (updates.q) params.set("q", updates.q);
    router.push(`/shop?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: q.trim() || null });
  }

  return (
    <div className="bg-white">
      <div className="container-trizen-full py-3 md:py-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={!activeGear || !isShopGearLine(activeGear)}
              onClick={() => updateParams({ gear: null })}
            >
              All
            </FilterPill>
            {SHOP_GEAR_ORDER.map((gear) => (
              <FilterPill
                key={gear}
                active={activeGear === gear}
                onClick={() => updateParams({ gear })}
              >
                {SHOP_GEAR_COPY[gear].title}
              </FilterPill>
            ))}
          </div>

          <SearchField
            className="hidden lg:block lg:max-w-xs"
            q={q}
            onChange={setQ}
            onSubmit={handleSearch}
            onClear={() => updateParams({ q: null })}
          />
        </div>
      </div>

      <div className="sticky top-14 z-40 bg-white lg:hidden">
        <div className="container-trizen-full py-2">
          <SearchField q={q} onChange={setQ} onSubmit={handleSearch} onClear={() => updateParams({ q: null })} />
        </div>
      </div>
    </div>
  );
}

function SearchField({
  q,
  onChange,
  onSubmit,
  onClear,
  className = "",
}: {
  q: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
      <input
        type="search"
        placeholder="SEARCH..."
        value={q}
        onChange={(e) => onChange(e.target.value)}
        className="trizen-box-field normal-case tracking-normal placeholder:uppercase"
      />
      {q ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-black transition-opacity hover:opacity-70"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      ) : null}
    </form>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`trizen-wh-mono border px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] transition-colors md:px-4 md:py-2.5 ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );
}
