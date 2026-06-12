"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingCart, User, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useCartUi } from "@/lib/cart-ui-store";
import { cn } from "@/lib/utils";

const iconStroke = 1.75;

const items = [
  { href: "/shop", label: "Shop", icon: Store, match: (p: string) => p === "/shop" || p.startsWith("/product") },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p === "/cart" },
  {
    href: "/account",
    label: "My account",
    icon: User,
    match: (p: string) =>
      p === "/account" || p === "/sign-in" || p === "/register",
  },
  { href: "/wishlist", label: "Wishlist", icon: Heart, match: (p: string) => p === "/wishlist" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCart((s) => s.totalItems());
  const cartOpen = useCartUi((s) => s.isOpen);
  const openCart = useCartUi((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart"
  ) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-white/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid h-16 grid-cols-4">
        {items.map(({ href, label, icon: Icon, match }) => {
          const isCart = href === "/cart";
          const active = isCart ? cartOpen : match(pathname);

          if (isCart) {
            return (
              <button
                key={href}
                type="button"
                onClick={openCart}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 px-1 transition-colors",
                  active ? "text-black" : "text-zinc-800"
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={iconStroke} />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium capitalize tracking-wide">
                  {label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 px-1 transition-colors",
                active ? "text-black" : "text-zinc-800"
              )}
            >
              <span className="relative">
                <Icon className="h-5 w-5" strokeWidth={iconStroke} />
              </span>
              <span className="text-[10px] font-medium capitalize tracking-wide">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
