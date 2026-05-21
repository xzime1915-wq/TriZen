"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/Button";
import { isInStock } from "@/components/StockBadge";
import { isUpcoming } from "@/lib/product-status";

type Props = {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  slug: string;
  tag?: string | null;
};

export function HomeProductActions({
  productId,
  name,
  price,
  image,
  stock,
  slug,
  tag,
}: Props) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const upcoming = isUpcoming(tag);
  const inStock = isInStock(stock);

  function handleAdd() {
    addItem({ productId, name, price, image, stock, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {upcoming ? (
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto min-w-[200px]"
            disabled
          >
            Upcoming
          </Button>
        ) : inStock ? (
          <Button size="lg" className="w-full sm:w-auto min-w-[200px]" onClick={handleAdd}>
            {added ? "Added to Cart" : "Add to Cart"}
          </Button>
        ) : (
          <Button
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto min-w-[200px]"
            disabled
          >
            Notify Me
          </Button>
        )}
        <Link href={`/product/${slug}`} className="w-full sm:w-auto">
          <Button size="lg" variant="secondary" className="w-full">
            View Product
          </Button>
        </Link>
      </div>
      <button
        type="button"
        onClick={() => router.push("/shop")}
        className="text-xs text-[var(--color-muted)] hover:text-white underline underline-offset-4"
      >
        More products in shop
      </button>
    </div>
  );
}
