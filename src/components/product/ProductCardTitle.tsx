import { TrizenBrandName } from "@/components/TrizenBrandName";
import { cn } from "@/lib/utils";

export function splitTrizenProductName(name: string) {
  const trimmed = name.trim();
  const match = trimmed.match(/^trizen\s+/i);
  if (!match) {
    return { hasBrand: false as const, rest: trimmed };
  }
  return { hasBrand: true as const, rest: trimmed.slice(match[0].length) };
}

export function ProductCardTitle({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const { hasBrand, rest } = splitTrizenProductName(name);

  if (!hasBrand) {
    return (
      <p className={cn("font-light uppercase tracking-[0.12em] text-black", className)}>
        {rest}
      </p>
    );
  }

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-1.5 font-light uppercase tracking-[0.12em] text-black",
        className
      )}
    >
      <TrizenBrandName className="inline-flex shrink-0 text-[1em] !font-light" />
      <span className="leading-snug font-light">{rest}</span>
    </p>
  );
}
