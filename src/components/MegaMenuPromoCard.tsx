"use client";

import Link from "next/link";
import type { ShopMegaPromo } from "@/lib/nav-config";

type Props = {
  promo: ShopMegaPromo;
  onNavigate?: () => void;
};

export function MegaMenuPromoCard({ promo, onNavigate }: Props) {
  return (
    <Link
      href={promo.href}
      onClick={onNavigate}
      className="trizen-mega-promo-item group block"
    >
      <h3 className="trizen-mega-promo-title">{promo.eyebrow}</h3>
      <p className="trizen-mega-promo-desc">{promo.description}</p>
      <span className="trizen-mega-promo-arrow" aria-hidden>
        →
      </span>
    </Link>
  );
}
