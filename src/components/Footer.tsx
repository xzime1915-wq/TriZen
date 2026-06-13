"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PayWithLogos } from "@/components/PayWithLogos";
import { SocialLinks } from "@/components/SocialLinks";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TrizenBrandName } from "@/components/TrizenBrandName";
import { EXPLORE_LINKS } from "@/lib/nav-config";

const SHOP_LINKS = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?gear=glass-mouse-pad", label: "Glass pads" },
  { href: "/shop?gear=soft-mouse-pad", label: "Soft pads" },
  { href: "/shop?gear=skates", label: "Mouse skates" },
  { href: "/shop?gear=hand-sleeves", label: "Sleeves" },
] as const;

const SUPPORT_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/track-order", label: "Track Your Order" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Shipping & Returns" },
] as const;

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="trizen-wh-mono mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-foreground)]">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm text-[var(--color-muted)]">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link href={item.href} className="trizen-footer-link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
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
  const showTrustBar = pathname !== "/" && pathname !== "/shop";

  return (
    <footer className="trizen-footer-dark relative mt-0 bg-black overflow-hidden max-lg:mb-[calc(4rem+env(safe-area-inset-bottom))]">
      {showTrustBar ? (
        <div className="trizen-wh-trust-bar">
          <span className="text-[var(--color-foreground)]">4.8 ★★★★★</span>
          <span className="mx-2 opacity-40">|</span>
          Customers rate us highly on product quality
          <span className="mx-2 opacity-40">|</span>
          Verified
        </div>
      ) : null}

      <div className="container-trizen relative py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <FooterColumn title="Shop" items={SHOP_LINKS} />
          <FooterColumn title="Support" items={SUPPORT_LINKS} />
          <FooterColumn title="TRIZEN" items={EXPLORE_LINKS} />
          <FooterColumn title="Terms & Conditions" items={LEGAL_LINKS} />
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="trizen-wh-mono mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-foreground)]">
              Newsletter
            </h4>
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] overflow-hidden">
        <div className="flex justify-center py-6 md:py-10">
          <TrizenBrandName
            className="trizen-brand-wordmark block w-full select-none whitespace-nowrap text-center leading-[0.8] text-[var(--color-foreground)] text-[21vw]"
            style={{
              WebkitTextStroke: "0.02em var(--color-foreground)",
              paintOrder: "stroke fill",
            } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="container-trizen flex flex-col items-center justify-between gap-4 py-5 md:flex-row">
          <p className="text-[11px] text-[var(--color-muted)]">
            © {year}{" "}
            <TrizenBrandName
              className="text-[var(--color-foreground)]"
              suffix=" Store"
            />
            {" · "}
            <a href="mailto:info@trizenstorebd.com" className="trizen-footer-link">
              info@trizenstorebd.com
            </a>
          </p>
          <SocialLinks className="gap-3" iconClassName="h-7 w-7" />
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
