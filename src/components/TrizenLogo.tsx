import Image, { type ImageProps } from "next/image";
import { getLogoSrc, type LogoVariant } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

type TrizenLogoProps = Omit<ImageProps, "src" | "alt"> & {
  variant?: LogoVariant;
  alt?: string;
};

export function TrizenLogo({
  variant = "on-light",
  alt = "TRIZEN Store",
  className,
  unoptimized = true,
  ...props
}: TrizenLogoProps) {
  return (
    <Image
      src={getLogoSrc(variant)}
      alt={alt}
      unoptimized={unoptimized}
      className={cn("object-contain", className)}
      {...props}
    />
  );
}
