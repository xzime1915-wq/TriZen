"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function ShopFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const activeCategory = searchParams.get("category");

  function updateParams(updates: { category?: string | null; q?: string | null }) {
    const params = new URLSearchParams(searchParams.toString());
    if (updates.category === null) params.delete("category");
    else if (updates.category) params.set("category", updates.category);
    if (updates.q === null) params.delete("q");
    else if (updates.q) params.set("q", updates.q);
    router.push(`/shop?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams({ q: q.trim() || null });
  }

  return (
    <div className="sticky top-[57px] z-40 border-b border-[var(--color-border)] bg-black/95 backdrop-blur-xl">
      <div className="container-trizen py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterPill
              active={!activeCategory}
              onClick={() => updateParams({ category: null })}
            >
              All
            </FilterPill>
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                active={activeCategory === cat}
                onClick={() => updateParams({ category: cat })}
              >
                {cat}
              </FilterPill>
            ))}
          </div>

          <form onSubmit={handleSearch} className="relative w-full lg:max-w-xs">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 pointer-events-none" />
            <input
              type="search"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border border-[var(--color-border)] bg-zinc-950 py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </div>
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
      className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] border transition-all duration-300 ${
        active
          ? "bg-white text-black border-white shadow-[0_0_24px_rgba(255,255,255,0.08)]"
          : "border-[var(--color-border)] text-zinc-500 hover:border-zinc-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
