"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { PayWithLogos } from "@/components/PayWithLogos";
import { SocialLinks } from "@/components/SocialLinks";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ReviewTrustBar } from "@/components/ReviewTrustBar";
import { TrizenBrandName } from "@/components/TrizenBrandName";
import { SITE_CONTACT } from "@/lib/site-config";
import { EXPLORE_LINKS } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

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

const MOBILE_ACCORDIONS = [
  { id: "shop", title: "Shop", items: SHOP_LINKS },
  { id: "support", title: "Support", items: SUPPORT_LINKS },
  { id: "trizen", title: "TRIZEN", items: EXPLORE_LINKS },
  { id: "terms", title: "Terms & Conditions", items: LEGAL_LINKS },
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
      <ul className="trizen-footer-nav-list">
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

function FooterMobileAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="trizen-footer-mobile-accordion">
      {MOBILE_ACCORDIONS.map((section) => {
        const open = openId === section.id;

        return (
          <div key={section.id} className="trizen-footer-mobile-accordion-item">
            <button
              type="button"
              className="trizen-footer-mobile-accordion-trigger"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : section.id)}
            >
              <span className="trizen-footer-mobile-accordion-title">
                {section.title}
              </span>
              <ChevronDown
                className={cn(
                  "trizen-footer-mobile-accordion-chevron",
                  open && "trizen-footer-mobile-accordion-chevron-open",
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>

            {open ? (
              <ul className="trizen-footer-mobile-accordion-panel">
                {section.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link href={item.href} className="trizen-footer-mobile-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
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
    <footer className="trizen-footer-dark relative mt-0 overflow-hidden bg-black">
      {showTrustBar ? (
        <ReviewTrustBar variant="dark" className="hidden lg:block" />
      ) : null}

      <div className="trizen-footer-mobile lg:hidden">
        <div className="trizen-footer-mobile-verified">
          <span className="trizen-footer-mobile-verified-text">Verified</span>
          <span className="trizen-footer-mobile-verified-mark" aria-hidden>
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>

        <FooterMobileAccordion />

        <div className="trizen-footer-mobile-sandbox">
          <h4 className="trizen-footer-mobile-sandbox-title">Sandbox</h4>
          <NewsletterForm variant="footer" />
        </div>
      </div>

      <div className="container-trizen relative hidden py-12 md:py-16 lg:block lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <FooterColumn title="Shop" items={SHOP_LINKS} />
          <FooterColumn title="Support" items={SUPPORT_LINKS} />
          <FooterColumn title="TRIZEN" items={EXPLORE_LINKS} />
          <FooterColumn title="Terms & Conditions" items={LEGAL_LINKS} />
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="trizen-wh-mono mb-5 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--color-foreground)]">
              Sandbox
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
        <div className="trizen-footer-mobile-bottom lg:hidden">
          <div className="trizen-footer-mobile-region">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/flags/bangladesh.png"
              alt=""
              aria-hidden
              className="h-3 w-[1.125rem] shrink-0 rounded-[1px] object-cover"
              width={18}
              height={12}
            />
            <span>Bangladesh (BDT ৳)</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" strokeWidth={1.5} aria-hidden />
          </div>

          <SocialLinks className="trizen-footer-mobile-social justify-center" />

          <p className="trizen-footer-mobile-copy">
            © {year} —{" "}
            <TrizenBrandName className="trizen-footer-bottom-brand" suffix=" Store" />
          </p>
        </div>

        <div className="container-trizen trizen-footer-bottom-bar hidden py-3 md:py-4 lg:grid">
          <div className="trizen-footer-bottom-center">
            <p className="trizen-footer-bottom-copy font-normal normal-case tracking-normal text-zinc-400">
              © {year}{" "}
              <TrizenBrandName
                className="trizen-footer-bottom-brand"
                suffix=" Store"
              />
              {" · "}
              <a href={`mailto:${SITE_CONTACT.email}`} className="trizen-footer-link">
                {SITE_CONTACT.email}
              </a>
            </p>
            <div className="trizen-footer-bottom-pay">
              <PayWithLogos className="justify-center gap-1" />
            </div>
          </div>
          <SocialLinks className="trizen-footer-bottom-social gap-2" />
        </div>
      </div>
    </footer>
  );
}
