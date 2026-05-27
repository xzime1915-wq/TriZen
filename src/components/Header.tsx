"use client";

import Link from "next/link";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Search, User, MessageCircle } from "lucide-react";
import { useChatStore } from "@/lib/chat-store";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import { ChatHeaderButton } from "@/components/chat/ChatHeaderButton";

type HeaderUser = { name: string | null; email: string } | null;

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/track-order", label: "Track Your Order" },
];

const iconClass = "h-[18px] w-[18px]";
const iconStroke = 1.5;

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
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-[var(--color-border)] bg-white/95 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="container-trizen relative flex h-14 items-center justify-between gap-6 lg:gap-6">
        {/* Mobile: MENU (left) */}
        <button
          type="button"
          className="hidden h-8 w-8 shrink-0 items-center justify-center text-zinc-900 transition-colors hover:text-zinc-600 max-lg:flex"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? (
            <X className={iconClass} strokeWidth={iconStroke} />
          ) : (
            <Menu className={iconClass} strokeWidth={iconStroke} />
          )}
        </button>

        {/* Branding — centered on mobile, left on desktop */}
        <Link
          href="/"
          className="group absolute left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 transition-opacity hover:opacity-80 lg:static lg:translate-x-0 lg:shrink-0"
        >
          <AnimatedLogo size="sm" variant="on-light" className="shrink-0" />
        </Link>

        <nav className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname === l.href ? "true" : "false"}
              className="trizen-nav-link pointer-events-auto"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: cart only */}
        <div className="ml-auto hidden items-center max-lg:flex">
          <Link
            href="/cart"
            className="trizen-header-icon relative text-zinc-900"
            aria-label="Cart"
          >
            <ShoppingCart className={iconClass} strokeWidth={iconStroke} />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-0.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-100 px-1 text-[9px] font-bold text-[var(--color-foreground)]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop: chat, account, search, cart */}
        <div className="relative z-10 ml-auto hidden items-center gap-0.5 sm:gap-1 lg:flex">
          <ChatHeaderButton className="trizen-header-icon" />
          <Link
            href={user ? "/account" : "/sign-in"}
            className="trizen-header-icon"
            aria-label={user ? "My account" : "Sign in"}
          >
            <User className={iconClass} strokeWidth={iconStroke} />
          </Link>
          <Link
            href="/shop"
            className="trizen-header-icon"
            aria-label="Search shop"
          >
            <Search className={iconClass} strokeWidth={iconStroke} />
          </Link>
          <Link href="/cart" className="trizen-header-icon relative" aria-label="Cart">
            <ShoppingCart className={iconClass} strokeWidth={iconStroke} />
            {mounted && totalItems > 0 && (
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-zinc-100 ring-2 ring-white" />
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-[var(--color-border)] bg-white/98 backdrop-blur-xl px-4 py-3">
          <button
            type="button"
            onClick={() => {
              useChatStore.getState().toggle();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <MessageCircle className={iconClass} strokeWidth={iconStroke} />
            Live Chat
          </button>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors",
                pathname === l.href ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-800"
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
              className="block py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
