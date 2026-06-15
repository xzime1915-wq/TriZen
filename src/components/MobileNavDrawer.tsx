"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { lockPageScroll, unlockPageScroll } from "@/lib/scroll-lock";
import {
  EXPLORE_LINKS,
  HEADER_NAV,
  MOUSE_PAD_MEGA_GROUPS,
  SHOP_MEGA_GROUPS,
  type HeaderMegaKey,
  type HeaderNavItem,
} from "@/lib/nav-config";

const iconStroke = 1.5;

type Props = {
  open: boolean;
  onClose: () => void;
  onTrackOrder: () => void;
  user: { name: string | null; email: string } | null;
};

type MegaGroup = {
  title: string;
  links: readonly { href: string; label: string }[];
};

const MOBILE_PRIMARY_NAV = HEADER_NAV.filter(
  (item): item is HeaderNavItem & { mega: NonNullable<HeaderNavItem["mega"]> } =>
    Boolean(item.mega),
);

const MOBILE_MEGA_PANELS: Record<HeaderMegaKey, readonly MegaGroup[]> = {
  shop: SHOP_MEGA_GROUPS,
  "mouse-pads": MOUSE_PAD_MEGA_GROUPS,
  explore: [{ title: "Explore", links: EXPLORE_LINKS }],
};

function MobileNavSubPanel({
  groups,
  onBack,
  onNavigate,
}: {
  groups: readonly MegaGroup[];
  onBack: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="mobile-nav-drawer-sub">
      <button type="button" className="mobile-nav-drawer-back" onClick={onBack}>
        BACK
      </button>

      {groups.map((group) => (
        <section key={group.title} className="mobile-nav-drawer-sub-group">
          <h3 className="mobile-nav-drawer-sub-heading">{group.title}</h3>
          <ul className="mobile-nav-drawer-sub-list">
            {group.links.map((link) => (
              <li key={link.href + link.label}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="mobile-nav-drawer-sub-link"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function MobileNavDrawer({ open, onClose, onTrackOrder, user }: Props) {
  const [activePanel, setActivePanel] = useState<HeaderMegaKey | null>(null);

  useEffect(() => {
    if (!open) return;
    lockPageScroll();
    return () => unlockPageScroll();
  }, [open]);

  useEffect(() => {
    if (!open) setActivePanel(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (activePanel) {
        setActivePanel(null);
        return;
      }
      onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, activePanel]);

  if (!open) return null;

  const accountHref = user ? "/account" : "/sign-in";
  const accountLabel = user ? user.name || "Account" : "Account";
  const panelGroups = activePanel ? MOBILE_MEGA_PANELS[activePanel] : null;

  return (
    <div className="mobile-nav-drawer-root lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="mobile-nav-drawer-backdrop"
        onClick={onClose}
        aria-label="Close menu"
      />

      <aside className="mobile-nav-drawer-panel">
        <div className="mobile-nav-drawer-body" data-lenis-prevent>
          {panelGroups ? (
            <MobileNavSubPanel
              groups={panelGroups}
              onBack={() => setActivePanel(null)}
              onNavigate={onClose}
            />
          ) : (
            <>
              <nav className="mobile-nav-drawer-primary" aria-label="Main">
                {MOBILE_PRIMARY_NAV.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActivePanel(item.mega)}
                    className="mobile-nav-drawer-primary-link text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mobile-nav-drawer-divider" />

              <nav className="mobile-nav-drawer-secondary" aria-label="More">
                {EXPLORE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="mobile-nav-drawer-secondary-link"
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onTrackOrder();
                  }}
                  className="mobile-nav-drawer-secondary-link text-left"
                >
                  Track Order
                </button>
              </nav>

              <div className="mobile-nav-drawer-social-wrap">
                <SocialLinks className="mobile-nav-drawer-social" />
              </div>

              <div className="mobile-nav-drawer-footer">
                <div className="mobile-nav-drawer-meta">
                  <div className="mobile-nav-drawer-region">
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
                  </div>

                  <Link
                    href={accountHref}
                    onClick={onClose}
                    className="mobile-nav-drawer-account"
                  >
                    <User className="h-4 w-4" strokeWidth={iconStroke} aria-hidden />
                    <span>{accountLabel}</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
