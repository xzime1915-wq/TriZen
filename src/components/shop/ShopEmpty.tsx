import Link from "next/link";
import { ShopGearEmptyState } from "@/components/shop/ShopGearEmptyState";
import type { ShopGearLine } from "@/lib/shop-gears";

type Props = {
  gear?: ShopGearLine;
  gearLabel?: string;
};

export function ShopEmpty({ gear, gearLabel }: Props) {
  if (gear && gearLabel) {
    return (
      <ShopGearEmptyState
        gear={gear}
        title={gearLabel}
        showBrowseLink
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center border border-[var(--color-border)] bg-zinc-50/50 py-32 text-center md:py-40">
      <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-600">
        No results
      </p>
      <h2 className="mt-4 text-xl font-bold uppercase tracking-tight text-[var(--color-foreground)]">
        Nothing found
      </h2>
      <p className="mt-3 max-w-sm text-sm text-zinc-500">
        Try another category or clear your search.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex bg-white px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-black hover:bg-zinc-200"
      >
        View all products
      </Link>
    </div>
  );
}
