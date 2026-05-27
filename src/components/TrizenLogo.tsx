import Image, { type ImageProps } from "next/image";
import { getLogoSrc, type LogoVariant } from "@/lib/brand-logos";
import { cn } from "@/lib/utils";

type TrizenLogoProps = Omit<ImageProps, "src" | "alt"> & {
  variant?: LogoVariant;
  alt?: string;
};

export function TrizenLogo({
  variant = "on-light",
  alt = "TriZen Store",
  className,
  ...props
}: TrizenLogoProps) {
  return (
    <Image
      src={getLogoSrc(variant)}
      alt={alt}
      className={cn("object-contain", variant === "on-light" && "invert", className)}
      {...props}
    />
  );
}
