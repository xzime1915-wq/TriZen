"use client";

import Link from "next/link";
import { TrizenLogo } from "@/components/TrizenLogo";
import { SearchDrawer } from "@/components/SearchDrawer";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X, Search, User } from "lucide-react";
import { TrizenCartIcon } from "@/components/TrizenCartIcon";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-store";
import { useCartUi } from "@/lib/cart-ui-store";
import { useTrackOrderUi } from "@/lib/track-order-ui-store";
import { cn } from "@/lib/utils";
import { ChatHeaderButton } from "@/components/chat/ChatHeaderButton";
import { MegaMenuPromoCard } from "@/components/MegaMenuPromoCard";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { SocialLinks } from "@/components/SocialLinks";
import {
  EXPLORE_LINKS,
  HEADER_NAV,
  MOUSE_PAD_MEGA_GROUPS,
  MOUSE_PAD_MEGA_PROMOS,
  SHOP_MEGA_GROUPS,
  SHOP_MEGA_PROMOS,
  type HeaderMegaKey,
  type HeaderNavItem,
} from "@/lib/nav-config";

type HeaderUser = { name: string | null; email: string } | null;

const iconClass = "h-[18px] w-[18px]";
const iconStroke = 1.5;

function isNavActive(
  pathname: string,
  item: HeaderNavItem,
  gear: string | null,
) {
  const mega = item.mega;

  if (mega === "mouse-pads") {
    return (
      gear === "glass-mouse-pad" ||
      gear === "soft-mouse-pad" ||
      (pathname.startsWith("/product/") && pathname.includes("tripad"))
    );
  }

  if (mega === "shop") {
    if (gear === "glass-mouse-pad" || gear === "soft-mouse-pad") {
      return false;
    }
    if (pathname.startsWith("/product/") && pathname.includes("tripad")) {
      return false;
    }
    return pathname === "/shop" || pathname.startsWith("/shop?");
  }

  if (mega === "explore") {
    return ["/about", "/blog", "/contact"].some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
  }

  if (item.drawer === "track-order") {
    return false;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function CartCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <span className="absolute -right-0.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function Header({ user = null }: { user?: HeaderUser }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gear = searchParams.get("gear");
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<HeaderMegaKey | null>(null);
  const [mounted, setMounted] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const totalItems = useCart((s) => s.totalItems());
  const openCart = useCartUi((s) => s.openCart);
  const openTrackOrder = useTrackOrderUi((s) => s.openTrackOrder);
  const trackOrderOpen = useTrackOrderUi((s) => s.isOpen);

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
    if (open || searchOpen) {
      setHeaderHidden(false);
    }
  }, [open, searchOpen]);

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

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "top-0 bg-white transition-transform duration-300 ease-in-out motion-reduce:transition-none",
          open ? "fixed inset-x-0 z-[60] lg:sticky lg:z-50" : "sticky z-50",
          headerHidden && !open && !searchOpen && "-translate-y-full",
        )}
      >
        <div className="container-trizen-full relative flex h-14 items-center justify-between gap-4 lg:h-16">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-zinc-900 transition-colors hover:text-zinc-600 lg:hidden"
            onClick={() => {
              setMegaOpen(null);
              setHeaderHidden(false);
              setOpen((value) => !value);
            }}
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
              const active =
                isNavActive(pathname, item, gear) ||
                (item.drawer === "track-order" && trackOrderOpen);

              const className = cn(
                "trizen-nav-link",
                (active || (mega && megaOpen === mega)) &&
                  "trizen-nav-link-active",
              );

              if (item.drawer === "track-order") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onMouseEnter={() => setMegaOpen(null)}
                    onFocus={() => setMegaOpen(null)}
                    onClick={() => {
                      setMegaOpen(null);
                      openTrackOrder();
                    }}
                    className={className}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => {
                    if (mega) setMegaOpen(mega);
                    else setMegaOpen(null);
                  }}
                  onFocus={() => {
                    if (mega) setMegaOpen(mega);
                    else setMegaOpen(null);
                  }}
                  onClick={() => setMegaOpen(null)}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <span
              className="trizen-header-region mr-2 hidden items-center gap-1.5 text-zinc-900 xl:inline-flex"
              title="Bangladesh"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/flags/bangladesh.png"
                alt=""
                aria-hidden
                className="h-3 w-[1.125rem] shrink-0 rounded-[1px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                width={18}
                height={12}
              />
              <span className="trizen-wh-ui">BDT ৳</span>
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
                <TrizenCartIcon className={iconClass} strokeWidth={iconStroke} />
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
                <TrizenCartIcon className={iconClass} strokeWidth={iconStroke} />
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
                <div className="trizen-mega-shop">
                  <div className="trizen-mega-shop-links">
                    {SHOP_MEGA_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="trizen-mega-group-title mb-4">
                          {group.title}
                        </p>
                        <ul className="space-y-0.5">
                          {group.links.map((link) => (
                            <li key={link.href + link.label}>
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
                  <div className="trizen-mega-promo-grid trizen-mega-promo-grid--duo">
                    {SHOP_MEGA_PROMOS.map((promo) => (
                      <MegaMenuPromoCard
                        key={promo.eyebrow}
                        promo={promo}
                        onNavigate={() => setMegaOpen(null)}
                      />
                    ))}
                  </div>
                </div>
              ) : megaOpen === "mouse-pads" ? (
                <div className="trizen-mega-shop trizen-mega-shop--mouse-pads">
                  <div className="trizen-mega-shop-links">
                    {MOUSE_PAD_MEGA_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="trizen-mega-group-title mb-4">
                          {group.title}
                        </p>
                        <ul className="space-y-0.5">
                          {group.links.map((link) => (
                            <li key={link.href + link.label}>
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
                  <div className="trizen-mega-promo-grid">
                    {MOUSE_PAD_MEGA_PROMOS.map((promo) => (
                      <MegaMenuPromoCard
                        key={promo.eyebrow}
                        promo={promo}
                        onNavigate={() => setMegaOpen(null)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="trizen-mega-explore">
                  <div className="trizen-mega-explore-links">
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
                  <SocialLinks className="trizen-mega-explore-social" />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        onTrackOrder={openTrackOrder}
        user={user}
      />

      <SearchDrawer open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
