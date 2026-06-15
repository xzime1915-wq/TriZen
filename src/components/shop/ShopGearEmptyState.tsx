import Link from "next/link";
import { GearNotifyButton } from "@/components/shop/GearNotifyButton";
import type { ShopGearLine } from "@/lib/shop-gears";

type Props = {
  gear: ShopGearLine;
  title: string;
  compact?: boolean;
  showBrowseLink?: boolean;
};

export function ShopGearEmptyState({
  gear,
  title,
  compact = false,
  showBrowseLink = false,
}: Props) {
  if (compact) {
    return (
      <div className="shop-gear-empty shop-gear-empty--compact flex flex-col items-center py-10 text-center md:py-14">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-500">
          Not launched yet
        </p>
        <p className="mt-3 max-w-sm text-sm text-zinc-500">
          {title} is coming to TRIZEN Store. Get notified at launch.
        </p>
        <GearNotifyButton gear={gear} gearName={title} className="mt-6 w-full max-w-[17.5rem]" />
      </div>
    );
  }

  return (
    <div className="shop-gear-empty flex flex-col items-center justify-center border border-[var(--color-border)] bg-zinc-50/50 py-24 text-center md:py-32">
      <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-zinc-600">
        Not launched yet
      </p>
      <h2 className="mt-4 text-xl font-bold uppercase tracking-tight text-[var(--color-foreground)]">
        {title}
      </h2>
      <p className="mt-3 max-w-sm text-sm text-zinc-500">
        This category is not live yet. Join the notify list and we will email
        you when it launches.
      </p>
      <div className="shop-gear-empty-actions mt-8 flex w-full max-w-[17.5rem] flex-col gap-3">
        <GearNotifyButton gear={gear} gearName={title} className="w-full" />
        {showBrowseLink ? (
          <Link
            href="/shop"
            className="shop-gear-empty-browse inline-flex w-full items-center justify-center bg-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black ring-1 ring-zinc-200 transition hover:bg-zinc-100"
          >
            View all products
          </Link>
        ) : null}
      </div>
    </div>
  );
}
