"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { ProductNotifyButton } from "@/components/product/ProductNotifyButton";
import { isUpcoming } from "@/lib/product-status";

type Props = {
  slug: string;
  productName: string;
  tag?: string | null;
};

export function HomeProductActions({ slug, productName, tag }: Props) {
  const upcoming = isUpcoming(tag);

  return (
    <div className="flex w-full flex-col gap-3">
      {upcoming ? (
        <ProductNotifyButton productSlug={slug} productName={productName} />
      ) : (
        <>
          <Link href={`/product/${slug}`} className="w-full">
            <Button size="lg" className="w-full">
              Shop now
            </Button>
          </Link>
          <Link href="/shop" className="w-full">
            <Button size="lg" variant="secondary" className="w-full">
              View collection
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
