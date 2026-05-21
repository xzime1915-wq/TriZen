"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive,
  onChange,
}: {
  value: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : undefined}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              interactive && "cursor-pointer hover:scale-110 transition",
              !interactive && "cursor-default"
            )}
            aria-label={`${i + 1} stars`}
          >
            <Star
              className={cn(
                iconClass,
                filled ? "fill-amber-400 text-amber-400" : "text-zinc-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
