"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { ProductColor } from "@/lib/product-data";
import { checkoutProductTitle, modelLabelFromProduct } from "@/lib/product-edition";
import { ProductNotifyButton } from "@/components/product/ProductNotifyButton";
import { Button } from "./Button";
import { Minus, Plus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug?: string;
  price: number;
  compareAt?: number | null;
  image: string;
  stock: number;
};

export function AddToCartButton({
  product,
  color,
  colors = [],
  sku,
  comingSoon = false,
}: {
  product: Product;
  color?: string;
  colors?: ProductColor[];
  sku?: string | null;
  comingSoon?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (comingSoon) {
    if (!product.slug) {
      return (
        <Button disabled className="w-full" size="lg">
          Notify me
        </Button>
      );
    }

    return (
      <ProductNotifyButton
        productSlug={product.slug}
        productName={product.name}
      />
    );
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full" size="lg">
        Out of stock
      </Button>
    );
  }

  return (
    <div className="product-buy-actions w-full">
      <Button
        size="lg"
        className="w-full px-4"
        onClick={() => {
          const edition =
            color ??
            (colors.length === 1 ? colors[0]?.name : undefined) ??
            (sku ? modelLabelFromProduct(product.name, sku, product.slug) : undefined);
          const title = checkoutProductTitle(product.name);

          addItem({
            productId: product.id,
            name: edition ? `${title}, ${edition}` : product.name,
            baseName: title,
            price: product.price,
            compareAt: product.compareAt ?? null,
            image:
              colors.find((c) => c.name === color)?.image ?? product.image,
            stock: product.stock,
            quantity: qty,
            color: edition,
            variantOptions: colors.length > 1 ? colors : undefined,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
      >
        {added ? "Added to cart" : "Add to cart"}
      </Button>

      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Qty
        </span>
        <div className="inline-flex items-stretch border border-zinc-300 bg-white text-zinc-900">
          <button
            type="button"
            className="px-3 py-2 transition hover:bg-zinc-100"
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
          <span className="flex min-w-[2.5rem] items-center justify-center border-x border-zinc-300 px-2 text-sm font-medium tabular-nums">
            {qty}
          </span>
          <button
            type="button"
            className="px-3 py-2 transition hover:bg-zinc-100"
            onClick={() => setQty(Math.min(product.stock, qty + 1))}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
