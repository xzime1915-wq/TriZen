"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent"
        aria-hidden
      />
      <div
        className="trizen-glow-orb pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(100%,720px)] -translate-x-1/2 opacity-60"
        aria-hidden
      />

      <div className="container-trizen relative py-14 md:py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <Image src="/logo.png" alt="TriZen Store" width={40} height={40} />
            <span className="text-sm font-semibold tracking-[0.22em] uppercase text-white">
              TriZen Store
            </span>
          </div>
          <p className="text-[var(--color-muted)] text-sm max-w-md leading-relaxed">
            Premium esports gear — mouse pads, hand sleeves, and mouse skates.
            Built for competitive play.
          </p>
        </div>
        <div>
          <h4 className="trizen-eyebrow mb-5 text-zinc-400">Shop</h4>
          <ul className="space-y-3 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/shop" className="trizen-footer-link">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Mouse Pads" className="trizen-footer-link">
                Mouse Pads
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Hand Sleeves" className="trizen-footer-link">
                Hand Sleeves
              </Link>
            </li>
            <li>
              <Link href="/shop?category=Mouse Skates" className="trizen-footer-link">
                Mouse Skates
              </Link>
            </li>
            <li>
              <Link href="/cart" className="trizen-footer-link">
                Cart
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="trizen-eyebrow mb-5 text-zinc-400">Support</h4>
          <ul className="space-y-3 text-sm text-[var(--color-muted)]">
            <li>
              <Link href="/contact" className="trizen-footer-link">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="trizen-footer-link">
                About
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="trizen-footer-link">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] py-7 text-center text-xs text-zinc-600 space-y-1.5">
        <p>© {new Date().getFullYear()} TriZen Store. All rights reserved.</p>
        <p className="text-[10px] opacity-80">
          Typeface: New Academy by Gustavo Paz L. (CC BY-SA 4.0)
        </p>
      </div>
    </footer>
  );
}
