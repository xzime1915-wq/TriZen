import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  strokeWidth?: number;
};

export function TrizenCartIcon({
  className,
  strokeWidth = 1.5,
}: Props) {
  return (
    <ShoppingBag
      className={cn("shrink-0", className)}
      strokeWidth={strokeWidth}
      aria-hidden
    />
  );
}
