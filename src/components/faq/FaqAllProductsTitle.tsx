import { cn } from "@/lib/utils";

export function FaqAllProductsTitle({
  children = "FAQ ALL PRODUCTS",
  className,
}: {
  children?: string;
  className?: string;
}) {
  return (
    <h2 className={cn("trizen-display-title mb-8 md:mb-10", className)}>
      {children}
    </h2>
  );
}
