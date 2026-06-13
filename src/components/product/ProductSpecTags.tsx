import { cn } from "@/lib/utils";
import { TrizenBrandName } from "@/components/TrizenBrandName";

export function ProductSpecTags({
  tags,
  className,
}: {
  tags: { label: string; tone: "amber" | "neutral" }[];
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={cn(
            "trizen-wh-spec-tag",
            tag.tone === "amber" ? "trizen-wh-spec-tag--amber" : "trizen-wh-spec-tag--neutral"
          )}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

export function ProductBrandStrip({ className }: { className?: string }) {
  return (
    <span className={cn("trizen-wh-brand-strip", className)} aria-hidden>
      <TrizenBrandName vertical className="text-[7px] text-white sm:text-[8px]" />
    </span>
  );
}
