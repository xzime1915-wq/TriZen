import Link from "next/link";
import { Banknote, Shield, Truck } from "lucide-react";
import { DELIVERY_CHARGE } from "@/lib/utils";
import { SITE_CONTACT } from "@/lib/site-config";
import type { ProductSpec } from "@/lib/product-data";
import { getShopGearLine, SHOP_GEAR_COPY } from "@/lib/shop-gears";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Bangladesh delivery",
    detail: `Flat ৳${DELIVERY_CHARGE} nationwide`,
  },
  {
    icon: Banknote,
    title: "Easy payment",
    detail: "COD · bKash · Nagad · Bank",
  },
  {
    icon: Shield,
    title: "Official TriZen",
    detail: "Quality checked before dispatch",
  },
] as const;

function pickQuickSpecs(specs: ProductSpec[], limit = 5): ProductSpec[] {
  const skip = new Set(["product", "sold by", "sku"]);
  const filtered = specs.filter(
    (s) => !skip.has(s.label.trim().toLowerCase())
  );
  return filtered.slice(0, limit);
}

export function ProductPurchaseInfo({
  specifications,
  sku,
  category,
  slug,
  name,
  stock,
  upcoming,
}: {
  specifications: ProductSpec[];
  sku: string | null;
  category: string;
  slug: string;
  name: string;
  stock: number;
  upcoming?: boolean;
}) {
  const quickSpecs = pickQuickSpecs(specifications);
  const gear = getShopGearLine(slug, name, category);
  const gearTitle = SHOP_GEAR_COPY[gear].title;
  const edition = specifications.find(
    (s) => s.label.toLowerCase() === "edition"
  )?.value;
  const series = specifications.find(
    (s) => s.label.toLowerCase() === "series"
  )?.value;

  return (
    <div className="mt-8 space-y-6 border-t border-[var(--color-border)] pt-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, detail }) => (
          <div
            key={title}
            className="flex gap-3 border border-[var(--color-border)] bg-zinc-50/60 px-3 py-3"
          >
            <Icon
              className="h-4 w-4 shrink-0 text-zinc-700 mt-0.5"
              strokeWidth={1.75}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-foreground)]">
                {title}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-muted)] normal-case">
                {detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      {quickSpecs.length > 0 && (
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)] mb-3">
            At a glance
          </h3>
          <dl className="grid gap-2 sm:grid-cols-2">
            {quickSpecs.map((spec) => (
              <div
                key={spec.label}
                className="border border-[var(--color-border)] bg-white px-3 py-2.5"
              >
                <dt className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--color-foreground)] normal-case leading-snug">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href="#product-details"
            className="mt-3 inline-block text-xs uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:underline"
          >
            Full description, specs & reviews ↓
          </a>
        </div>
      )}

      <div className="border border-[var(--color-border)] bg-zinc-50/40 px-4 py-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-foreground)] mb-3">
          Product details
        </h3>
        <dl className="space-y-2.5 text-sm">
          {sku && (
            <div className="flex justify-between gap-4 border-b border-[var(--color-border)]/60 pb-2">
              <dt className="text-[var(--color-muted)] shrink-0">SKU</dt>
              <dd className="font-mono text-right text-[var(--color-foreground)]">
                {sku}
              </dd>
            </div>
          )}
          {edition && (
            <div className="flex justify-between gap-4 border-b border-[var(--color-border)]/60 pb-2">
              <dt className="text-[var(--color-muted)] shrink-0">Edition</dt>
              <dd className="text-right normal-case">{edition}</dd>
            </div>
          )}
          {series && (
            <div className="flex justify-between gap-4 border-b border-[var(--color-border)]/60 pb-2">
              <dt className="text-[var(--color-muted)] shrink-0">Series</dt>
              <dd className="text-right normal-case">{series}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-b border-[var(--color-border)]/60 pb-2">
            <dt className="text-[var(--color-muted)] shrink-0">Line</dt>
            <dd className="text-right">
              <Link
                href={`/shop?gear=${gear}`}
                className="hover:underline normal-case"
              >
                {gearTitle}
              </Link>
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-[var(--color-border)]/60 pb-2">
            <dt className="text-[var(--color-muted)] shrink-0">Category</dt>
            <dd className="text-right normal-case">{category}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--color-muted)] shrink-0">Availability</dt>
            <dd className="text-right font-medium">
              {upcoming
                ? "Upcoming"
                : stock > 0
                  ? `${stock} in stock`
                  : "Out of stock"}
            </dd>
          </div>
        </dl>
      </div>

      <p className="text-xs text-[var(--color-muted)] normal-case leading-relaxed">
        Questions? Call{" "}
        <a
          href={`tel:${SITE_CONTACT.phone}`}
          className="text-[var(--color-foreground)] hover:underline"
        >
          {SITE_CONTACT.phoneDisplay}
        </a>{" "}
        or{" "}
        <Link href="/contact" className="text-[var(--color-foreground)] hover:underline">
          contact us
        </Link>
        .
      </p>
    </div>
  );
}
