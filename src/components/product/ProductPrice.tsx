import { formatCurrency } from "@/lib/utils";
import { shouldShowProductPrice } from "@/lib/product-status";

type Props = {
  price: number;
  compareAt?: number | null;
  tag?: string | null;
  className?: string;
  compareClassName?: string;
};

export function ProductPrice({
  price,
  compareAt,
  tag,
  className = "text-2xl font-semibold text-emerald-400",
  compareClassName = "text-lg text-[var(--color-muted)] line-through",
}: Props) {
  if (!shouldShowProductPrice(tag)) {
    return null;
  }

  return (
    <div className="flex items-baseline gap-3">
      <span className={className}>{formatCurrency(price)}</span>
      {compareAt != null && compareAt > price && (
        <span className={compareClassName}>{formatCurrency(compareAt)}</span>
      )}
    </div>
  );
}
