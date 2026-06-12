import Image from "next/image";
import { ProductImage } from "@/components/ProductImage";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { cn } from "@/lib/utils";
type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  interactive?: boolean;
  imageScale?: number;
  /** `large` = home featured + product page (fills column width) */
  variant?: "default" | "large";
};

/** Pad image frame — home featured + product gallery. */
export function ProductVisualFrame({
  src,
  alt,
  priority,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className,
  interactive = false,
  imageScale = 1,
  variant = "default",
}: Props) {
  const large = variant === "large";
  const resolved = displayImageSrc(src);

  if (large) {
    return (
      <div
        className={cn(
          "product-visual-frame product-visual-frame--large w-full",
          className
        )}
      >
        <div
          className={cn(imageScale !== 1 && "origin-center")}
          style={imageScale !== 1 ? { transform: `scale(${imageScale})` } : undefined}
        >
          <Image
            src={resolved}
            alt={alt}
            width={3200}
            height={2800}
            priority={priority}
            sizes={sizes}
            quality={IMAGE_QUALITY}
            className={cn(
              "mx-auto block h-auto w-full max-w-full object-contain object-center",
              "max-h-[min(108vw,820px)] sm:max-h-[min(100vw,900px)] lg:max-h-[min(85vh,1000px)]",
              interactive &&
                "transition-transform duration-500 group-hover:scale-[1.01]"
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("product-visual-frame", className)}>
      <ProductImage
        src={src}
        alt={alt}
        priority={priority}
        sizes={sizes}
        className="object-contain object-center p-4 sm:p-6 lg:p-6"
      />
    </div>
  );
}
