"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ProductHoverAction,
  type ProductHoverData,
} from "@/components/product/ProductHoverAction";
import { displayImageSrc } from "@/lib/image-path";
import { IMAGE_QUALITY } from "@/lib/image-quality";
import { shouldShowProductPrice } from "@/lib/product-status";
import { formatCurrency } from "@/lib/utils";

const padImgClass = "edition-showcase-pad-img";

export function ShopShowcaseProductCell({
  href,
  label,
  product,
  imageSrc,
  imageAlt,
}: {
  href: string;
  label: string;
  product: ProductHoverData;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <article className="edition-showcase-cell group flex flex-col items-start">
      <Link href={href} className="block w-full">
        <div className="edition-showcase-cell-visual relative w-full overflow-hidden">
          <Image
            src={displayImageSrc(imageSrc)}
            alt={imageAlt}
            width={2400}
            height={1920}
            className={padImgClass}
            sizes="(max-width: 640px) 50vw, 25vw"
            quality={IMAGE_QUALITY}
          />
          <ProductHoverAction product={product} />
        </div>
      </Link>
      <Link href={href} className="w-full">
        <div className="edition-showcase-cell-meta">
          <p className="edition-showcase-cell-label">{label}</p>
          {shouldShowProductPrice(product.tag) ? (
            <p className="edition-showcase-cell-price">
              {formatCurrency(product.price)}
            </p>
          ) : (
            <p className="edition-showcase-cell-price">Price at launch</p>
          )}
        </div>
      </Link>
    </article>
  );
}
