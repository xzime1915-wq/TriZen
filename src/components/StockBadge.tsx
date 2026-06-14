import { cn } from "@/lib/utils";

export function StockBadge({
  inStock,
  upcoming = false,
  size = "sm",
  className,
}: {
  inStock: boolean;
  upcoming?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  if (upcoming) {
    return (
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1.5 font-light uppercase tracking-wider leading-none text-zinc-600",
          size === "sm" ? "text-[10px]" : "text-[11px]",
          className
        )}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" aria-hidden />
        Upcoming
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 font-light uppercase tracking-wider leading-none",
        size === "sm" ? "text-[10px]" : "text-[11px]",
        inStock ? "text-emerald-400" : "text-red-400",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full bg-current",
          inStock ? "opacity-90" : "opacity-90"
        )}
        aria-hidden
      />
      {inStock ? "In Stock" : "Out of Stock"}
    </span>
  );
}

export function isInStock(stock: number) {
  return stock > 0;
}
