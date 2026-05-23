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
          ? "border-white/[0.06] bg-black/90 backdrop-blur-xl"
          : "border-transparent bg-black/40 backdrop-blur-sm"
      )}
    >
      <div className="container-trizen flex h-14 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-80"
        >
          <AnimatedLogo size="sm" />
          <span className="hidden sm:block text-[11px] font-medium tracking-[0.26em] uppercase text-white/90">
            TriZen Store
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={pathname === l.href ? "true" : "false"}
              className="trizen-nav-link"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <ChatHeaderButton className="trizen-header-icon hidden sm:flex" />
          <Link
            href={user ? "/account" : "/sign-in"}
            className="trizen-header-icon hidden sm:flex"
            aria-label={user ? "My account" : "Sign in"}
          >
            <User className={iconClass} strokeWidth={iconStroke} />
          </Link>
          <Link
            href="/shop"
            className="trizen-header-icon hidden md:flex"
            aria-label="Search shop"
          >
            <Search className={iconClass} strokeWidth={iconStroke} />
          </Link>
          <Link
            href="/cart"
            className="trizen-header-icon relative"
            aria-label="Cart"
          >
            <ShoppingCart className={iconClass} strokeWidth={iconStroke} />
            {mounted && totalItems > 0 && (
              <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white ring-2 ring-black" />
            )}
          </Link>
          <button
            type="button"
            className="trizen-header-icon lg:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <X className={iconClass} strokeWidth={iconStroke} />
            ) : (
              <Menu className={iconClass} strokeWidth={iconStroke} />
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl px-4 py-3">
          <button
            type="button"
            onClick={() => {
              useChatStore.getState().toggle();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
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
                pathname === l.href ? "text-white" : "text-zinc-500 hover:text-zinc-300"
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
