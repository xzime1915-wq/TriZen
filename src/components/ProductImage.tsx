import Image from "next/image";
import { displayImageSrc } from "@/lib/image-path";
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
  const resolved = displayImageSrc(src);

  return (
    <Image
      src={resolved}
      alt={alt}
      fill
      priority={priority}
      quality={85}
      sizes={sizes}
      className={cn("object-contain object-center", className)}
    />
  );
}
