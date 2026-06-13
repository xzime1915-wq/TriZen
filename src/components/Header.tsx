"use client";

import Link from "next/link";
import { TrizenLogo } from "@/components/TrizenLogo";
import { SearchDrawer } from "@/components/SearchDrawer";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, Menu, X, Search, User, MessageCircle } from "lucide-react";
import { useChatStore } from "@/lib/chat-store";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-store";
import { useCartUi } from "@/lib/cart-ui-store";
import { cn } from "@/lib/utils";
import { ChatHeaderButton } from "@/components/chat/ChatHeaderButton";
import { MegaMenuGearCard } from "@/components/MegaMenuGearCard";
import {
  EXPLORE_LINKS,
  HEADER_NAV,
  MOUSE_PAD_GROUPS,
  SHOP_MEGA_GROUPS,
} from "@/lib/nav-config";
import { OUR_GEARS } from "@/lib/our-gears";

type HeaderUser = { name: string | null; email: string } | null;
type MegaKey = "shop" | "mouse-pads" | "explore";

const iconClass = "h-[18px] w-[18px]";
const iconStroke = 1.5;

function CartCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-0.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function isNavActive(
  pathname: string,
  mega: MegaKey | undefined,
  gear: string | null,
) {
  if (mega === "mouse-pads") {
    return (
      gear === "glass-mouse-pad" ||
      gear === "soft-mouse-pad" ||
      (pathname.startsWith("/product/") &&
        (pathname.includes("tripad") || pathname.includes("soft")))
    );
  }
  if (mega === "shop") {
    if (!pathname.startsWith("/shop") && !pathname.startsWith("/product/")) {
      return false;
    }
    return gear !== "glass-mouse-pad" && gear !== "soft-mouse-pad";
  }
  if (mega === "explore") {
    return ["/about", "/blog", "/contact", "/track-order"].some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }
  return false;
}

const MOUSE_PAD_GEAR_IDS = ["glass-mouse-pad", "soft-mouse-pad"] as const;

function MegaGearGrid({
  gearIds,
  onNavigate,
  wide,
}: {
  gearIds: readonly string[];
  onNavigate: () => void;
  wide?: boolean;
}) {
  const gears = OUR_GEARS.filter((gear) => gearIds.includes(gear.id));

  return (
    <div
      className={cn(
        "trizen-mega-gear-grid",
        wide && "trizen-mega-gear-grid--wide",
      )}
    >
      {gears.map((gear, index) => (
        <MegaMenuGearCard
          key={gear.id}
          gear={gear}
          priority={index === 0}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

export function Header({ user = null }: { user?: HeaderUser }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gear = searchParams.get("gear");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<MegaKey | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCartUi((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMegaOpen(null);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMegaOpen(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const headerHeight = 72;

    function onScroll() {
      const y = window.scrollY;

      if (open || megaOpen || searchOpen || y <= 0) {
        setHeaderHidden(false);
      } else if (y > lastScrollY.current && y > headerHeight) {
        setHeaderHidden(true);
        setMegaOpen(null);
      } else if (y < lastScrollY.current) {
        setHeaderHidden(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, megaOpen, searchOpen]);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart"
  ) {
    return null;
  }

  const authLinks = user
    ? [{ href: "/account", label: user.name || "Account" }]
    : [
        { href: "/sign-in", label: "Sign In" },
        { href: "/register", label: "Register" },
      ];

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 bg-white transition-transform duration-300 ease-in-out motion-reduce:transition-none",
          headerHidden && "-translate-y-full",
        )}
      >
        <div className="container-trizen-full relative flex h-14 items-center justify-between gap-4 lg:h-16">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-zinc-900 transition-colors hover:text-zinc-600 lg:hidden"
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

          <Link
            href="/"
            aria-label="TRIZEN home"
            onClick={() => {
              setMegaOpen(null);
              setOpen(false);
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="absolute left-1/2 z-30 flex -translate-x-1/2 items-center transition-opacity hover:opacity-80 lg:static lg:translate-x-0 lg:shrink-0"
          >
            <TrizenLogo
              variant="on-light"
              width={128}
              height={128}
              className="h-9 w-9 lg:h-10 lg:w-10"
              priority
            />
          </Link>

          <nav className="relative z-20 hidden items-center gap-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:-translate-x-1/2 lg:-translate-y-1/2">
            {HEADER_NAV.map((item) => {
              const mega = item.mega;
              const active = isNavActive(pathname, mega, gear);

              return (
                <button
                  key={item.label}
                  type="button"
                  onMouseEnter={() => setMegaOpen(mega)}
                  onFocus={() => setMegaOpen(mega)}
                  className={cn(
                    "trizen-nav-link",
                    (active || megaOpen === mega) && "trizen-nav-link-active",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <span className="trizen-wh-ui mr-2 hidden text-zinc-500 xl:inline">
              Bangladesh (BDT ৳)
            </span>
            <div className="hidden items-center gap-0.5 lg:flex">
              <ChatHeaderButton className="trizen-header-icon" />
              <Link
                href={user ? "/account" : "/sign-in"}
                className="trizen-header-icon"
                aria-label={user ? "My account" : "Sign in"}
              >
                <User className={iconClass} strokeWidth={iconStroke} />
              </Link>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="trizen-header-icon"
                aria-label="Search"
              >
                <Search className={iconClass} strokeWidth={iconStroke} />
              </button>
              <button
                type="button"
                onClick={openCart}
                className="trizen-header-icon relative"
                aria-label={`Cart${mounted && totalItems > 0 ? `, ${totalItems} items` : ""}`}
              >
                <ShoppingCart className={iconClass} strokeWidth={iconStroke} />
                {mounted ? <CartCountBadge count={totalItems} /> : null}
              </button>
            </div>

            <div className="flex items-center gap-0.5 lg:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="trizen-header-icon"
                aria-label="Search"
              >
                <Search className={iconClass} strokeWidth={iconStroke} />
              </button>
              <button
                type="button"
                onClick={openCart}
                className="trizen-header-icon relative"
                aria-label={`Cart${mounted && totalItems > 0 ? `, ${totalItems} items` : ""}`}
              >
                <ShoppingCart className={iconClass} strokeWidth={iconStroke} />
                {mounted ? <CartCountBadge count={totalItems} /> : null}
              </button>
            </div>
          </div>
        </div>

        {megaOpen ? (
          <div
            className="trizen-mega-menu hidden lg:block"
            onMouseLeave={() => setMegaOpen(null)}
          >
            <div className="container-trizen-full py-8">
              {megaOpen === "shop" ? (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr]">
                  <div className="space-y-8">
                    {SHOP_MEGA_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="trizen-mega-group-title mb-3">
                          {group.title}
                        </p>
                        <ul className="space-y-1">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="trizen-mega-link"
                                onClick={() => setMegaOpen(null)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <MegaGearGrid
                    gearIds={OUR_GEARS.map((gear) => gear.id)}
                    onNavigate={() => setMegaOpen(null)}
                    wide
                  />
                </div>
              ) : megaOpen === "mouse-pads" ? (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,280px)_1fr]">
                  <div className="space-y-8">
                    {MOUSE_PAD_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="trizen-mega-group-title mb-3">
                          {group.title}
                        </p>
                        <ul className="space-y-1">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="trizen-mega-link"
                                onClick={() => setMegaOpen(null)}
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <MegaGearGrid
                    gearIds={MOUSE_PAD_GEAR_IDS}
                    onNavigate={() => setMegaOpen(null)}
                  />
                </div>
              ) : (
                <div className="grid max-w-md gap-1">
                  {EXPLORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="trizen-mega-link py-2"
                      onClick={() => setMegaOpen(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {open ? (
          <nav className="bg-white px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => {
                useChatStore.getState().toggle();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black"
            >
              <MessageCircle className={iconClass} strokeWidth={iconStroke} />
              Live Chat
            </button>
            {HEADER_NAV.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-black"
              >
                {item.label}
              </Link>
            ))}
            {EXPLORE_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 pl-4 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-600"
              >
                {l.label}
              </Link>
            ))}
            {authLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
