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
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={95}
      sizes={sizes}
      className={cn("object-contain object-center", className)}
    />
  );
}
