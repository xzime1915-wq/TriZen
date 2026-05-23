import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export function ProductImage({
  src,
  alt,
  priority,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProductImageProps) {
  // Large local PNGs (20MB+) fail Next image optimizer on VPS — serve directly.
  const unoptimized =
    src.startsWith("/products/") || src.startsWith("/uploads/");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={95}
      sizes={sizes}
      unoptimized={unoptimized}
      className={cn("object-contain object-center", className)}
    />
  );
}
