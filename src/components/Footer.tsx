"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { PayWithLogos } from "@/components/PayWithLogos";
import { SocialLinks } from "@/components/SocialLinks";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?category=Mouse Pads", label: "Mouse Pads" },
  { href: "/shop?category=Hand Sleeves", label: "Hand Sleeves" },
  { href: "/shop?category=Mouse Skates", label: "Mouse Skates" },
  { href: "/cart", label: "Cart" },
] as const;

const IMPORTANT_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/track-order", label: "Track Your Order" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact Us" },
  { href: "/about", label: "About" },
] as const;

function FooterLinkList({
  items,
}: {
  items: readonly { href: string; label: string }[];
}) {
  return (
    <ul className="space-y-3 text-sm text-[var(--color-muted)]">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="trizen-footer-link">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContactRow({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: typeof Phone;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group flex items-start gap-3 text-sm text-[var(--color-muted)] transition-colors hover:text-white"
    >
      <span className="trizen-footer-contact-icon">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="pt-1 leading-relaxed group-hover:translate-x-0.5 transition-transform">
        {children}
      </span>
    </a>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-[var(--color-border)] bg-black overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-600/40 to-transparent"
        aria-hidden
      />
      <div
        className="trizen-glow-orb pointer-events-none absolute -top-32 left-1/2 h-64 w-[min(100%,720px)] -translate-x-1/2 opacity-50"
        aria-hidden
      />

      <div className="container-trizen relative py-14 md:py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/logo.png" alt="TriZen Store" width={44} height={44} />
              <span className="text-sm font-semibold tracking-[0.22em] uppercase text-white">
                TriZen Store
              </span>
            </div>
            <p className="text-sm text-[var(--color-muted)] max-w-md leading-relaxed">
              Premium esports gear — glass mouse pads, hand sleeves, and mouse
              skates. Built for competitive play across Bangladesh.
            </p>
            <div className="mt-8 space-y-4 max-w-md">
              <ContactRow href="tel:+8801778741431" icon={Phone}>
                01778741431
              </ContactRow>
              <ContactRow href="mailto:info@trizenstorebd.com" icon={Mail}>
                info@trizenstorebd.com
              </ContactRow>
              <SocialLinks
                className="gap-4 pt-2"
                iconClassName="h-8 w-8"
              />
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">
              Categories
            </h4>
            <FooterLinkList items={SHOP_LINKS} />
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-5">
              Important Links
            </h4>
            <FooterLinkList items={IMPORTANT_LINKS} />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] bg-zinc-950/30">
        <div className="container-trizen py-6 md:py-8 text-center">
          <p className="text-xs text-zinc-500">
            Copyright © {year}{" "}
            <span className="text-white font-medium">TriZen Store</span>. All
            rights reserved.
          </p>
          <p className="mt-2 text-[10px] text-zinc-600 opacity-80">
            Typeface: New Academy by Gustavo Paz L. (CC BY-SA 4.0)
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="container-trizen py-6 md:py-7">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="trizen-pay-with-label shrink-0">Pay with</span>
            <div className="w-full max-w-full px-1 sm:px-0">
              <PayWithLogos className="mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
