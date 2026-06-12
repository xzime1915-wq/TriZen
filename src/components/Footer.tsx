"use client";

import Link from "next/link";
import { TrizenLogo } from "@/components/TrizenLogo";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { PayWithLogos } from "@/components/PayWithLogos";
import { SocialLinks } from "@/components/SocialLinks";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/shop?gear=glass-mouse-pad", label: "Glass Mouse Pad" },
  { href: "/shop?gear=soft-mouse-pad", label: "Soft Mouse Pad" },
  { href: "/shop?gear=skates", label: "Mouse Skates" },
  { href: "/shop?gear=hand-sleeves", label: "Hand Sleeves" },
  { href: "/cart", label: "Cart" },
] as const;

const IMPORTANT_LINKS = [
  { href: "/blog", label: "Blog" },
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
      className="group flex items-start gap-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
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
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname === "/cart"
  ) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="trizen-footer-dark relative mt-16 border-t border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden max-lg:mb-[calc(4rem+env(safe-area-inset-bottom))]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent"
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
              <TrizenLogo variant="on-dark" width={44} height={44} />
              <span className="text-sm font-semibold tracking-[0.22em] uppercase text-[var(--color-foreground)]">
                Trizen Store
              </span>
            </div>
            <p className="trizen-detail max-w-md text-[var(--color-muted)]">
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
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-foreground)] mb-5">
              Categories
            </h4>
            <FooterLinkList items={SHOP_LINKS} />
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-foreground)] mb-5">
              Important Links
            </h4>
            <FooterLinkList items={IMPORTANT_LINKS} />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] overflow-hidden">
        <div className="flex justify-center py-6 md:py-10">
          <span
            className="trizen-brand-wordmark block w-full select-none whitespace-nowrap text-center leading-[0.8] text-[var(--color-foreground)] text-[21vw]"
            style={{
              WebkitTextStroke: "0.02em var(--color-foreground)",
              paintOrder: "stroke fill",
            }}
          >
            Trizen
          </span>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="container-trizen py-4 text-center">
          <p className="text-[11px] text-[var(--color-muted)]">
            © {year} <span className="text-[var(--color-foreground)]">Trizen Store</span>
          </p>
        </div>
      </div>

      <div
        className="border-t border-[var(--color-border)] bg-white"
        style={
          {
            "--color-surface": "#ffffff",
            "--color-foreground": "#171717",
            "--color-border": "#e5e5e5",
            "--color-muted": "#3f3f46",
          } as React.CSSProperties
        }
      >
        <div className="container-trizen py-3 md:py-3.5">
          <div className="flex flex-col items-center gap-2">
            <span className="trizen-pay-with-label shrink-0">Pay with</span>
            <PayWithLogos className="mx-auto px-2" />
          </div>
        </div>
      </div>
    </footer>
  );
}
