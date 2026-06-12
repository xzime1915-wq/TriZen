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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {upcoming ? (
        <div className="w-full max-w-sm">
          <ProductNotifyButton productSlug={slug} productName={productName} />
        </div>
      ) : (
        <>
          <Link href={`/product/${slug}`} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:min-w-[200px]">
              Shop now
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:min-w-[200px]"
            >
              View collection
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
