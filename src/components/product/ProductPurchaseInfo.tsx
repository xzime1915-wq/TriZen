import Link from "next/link";
import { Banknote, Shield, Truck } from "lucide-react";
import { DELIVERY_CHARGE } from "@/lib/utils";
import { SITE_CONTACT } from "@/lib/site-config";

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: "Nationwide delivery",
    detail: `Flat ৳${DELIVERY_CHARGE}`,
  },
  {
    icon: Banknote,
    title: "COD · bKash · Nagad",
    detail: "Bank transfer",
  },
  {
    icon: Shield,
    title: "Official TRIZEN",
    detail: "Quality checked",
  },
] as const;

export function ProductPurchaseInfo() {
  return (
    <div className="product-buy-trust mt-8 pt-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex gap-2.5">
            <Icon
              className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-foreground)]">
                {title}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-muted)] normal-case">
                {detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[11px] leading-relaxed text-[var(--color-muted)] normal-case">
        Questions?{" "}
        <a
          href={`tel:${SITE_CONTACT.phone}`}
          className="text-[var(--color-foreground)] underline-offset-2 hover:underline"
        >
          {SITE_CONTACT.phoneDisplay}
        </a>{" "}
        ·{" "}
        <Link
          href="/contact"
          className="text-[var(--color-foreground)] underline-offset-2 hover:underline"
        >
          Contact
        </Link>
      </p>
    </div>
  );
}
