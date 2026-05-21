"use client";

import Link from "next/link";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type HeaderUser = { name: string | null; email: string } | null;

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const iconBtn =
  "p-2 text-[var(--color-muted)] transition-colors duration-300 hover:text-white";

export function Header({ user = null }: { user?: HeaderUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCart((s) => s.totalItems());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const authLinks = user
    ? [{ href: "/account", label: user.name || "Account" }]
    : [
        { href: "/sign-in", label: "Sign In" },
        { href: "/register", label: "Register" },
      ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-500",
        scrolled
          ? "border-zinc-800/90 bg-black/95 backdrop-blur-xl shadow-[0_12px_40px_-20px_rgba(0,0,0,0.9)]"
          : "border-[var(--color-border)] bg-black/80 backdrop-blur-md"
      )}
    >
      <div className="container-trizen flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3 shrink-0 transition-opacity hover:opacity-90"
        >
          <AnimatedLogo size="sm" />
          <span className="hidden sm:block text-sm font-semibold tracking-[0.28em] uppercase text-white">
            TriZen Store
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname === l.href ? "true" : "false"}
              className={cn(
                "trizen-nav-link",
                pathname === l.href ? "text-white" : "text-[var(--color-muted)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href={user ? "/account" : "/sign-in"}
            className={cn(iconBtn, "hidden sm:flex")}
            aria-label={user ? "My account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/shop"
            className={cn(iconBtn, "hidden md:flex")}
            aria-label="Search shop"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/cart" className={cn(iconBtn, "relative")} aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-sm bg-white text-[10px] font-bold text-black shadow-[0_0_12px_rgba(255,255,255,0.35)]">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 text-white transition-opacity hover:opacity-80"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[var(--color-border)] bg-black/98 backdrop-blur-xl px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-3 text-sm uppercase tracking-wide border-b border-[var(--color-border)] transition-colors",
                pathname === l.href ? "text-white" : "text-zinc-500"
              )}
            >
              {l.label}
            </Link>
          ))}
          {authLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm uppercase tracking-wide border-b border-[var(--color-border)] text-zinc-500 last:border-0 hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
