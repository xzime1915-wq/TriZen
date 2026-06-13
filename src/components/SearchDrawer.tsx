"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { MOUSE_PAD_MEGA_CARDS, SEARCH_SUGGESTIONS } from "@/lib/nav-config";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.classList.contains("trizen-scroll-locked");
    document.documentElement.classList.add("trizen-scroll-locked");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => {
      window.clearTimeout(timer);
      if (!prev) document.documentElement.classList.remove("trizen-scroll-locked");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    onClose();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  const featured = MOUSE_PAD_MEGA_CARDS;

  return (
    <div className="search-drawer-root" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        className="search-drawer-backdrop"
        onClick={onClose}
        aria-label="Close search"
      />
      <div className="search-drawer-panel">
        <header className="search-drawer-header">
          <button type="button" className="search-drawer-close" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <p className="search-drawer-title">Search</p>
          <span aria-hidden />
        </header>

        <div className="search-drawer-body" data-lenis-prevent>
          <form onSubmit={handleSubmit} className="relative">
            <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for..."
              className="trizen-wh-mono w-full border-0 border-b border-zinc-300 bg-transparent py-3 pl-7 pr-4 text-[11px] uppercase tracking-[0.18em] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </form>

          <div className="mt-10">
            <p className="trizen-wh-mono mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
              Suggested searches
            </p>
            <ul className="space-y-1">
              {SEARCH_SUGGESTIONS.map((item) => (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="search-drawer-link"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <p className="trizen-wh-mono mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">
              Are you looking for
            </p>
            <div className="grid grid-cols-2 gap-3">
              {featured.map((card) => (
                <Link
                  key={card.gear}
                  href={card.href}
                  onClick={onClose}
                  className="trizen-mega-card trizen-mega-card--text"
                >
                  <span className="trizen-mega-card-eyebrow">{card.status}</span>
                  <h3 className="trizen-mega-card-title text-base">{card.title}</h3>
                  <p className="trizen-mega-card-desc">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
