"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { ProductColor } from "@/lib/product-data";
import { Button } from "./Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  compareAt?: number | null;
  image: string;
  stock: number;
};

export function AddToCartButton({
  product,
  color,
  colors = [],
  comingSoon = false,
}: {
  product: Product;
  color?: string;
  colors?: ProductColor[];
  comingSoon?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (comingSoon) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Upcoming
      </Button>
    );
  }

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Out of Stock
      </Button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      <div className="flex items-center border border-zinc-900 bg-zinc-900 text-white">
        <button
          type="button"
          className="p-3 text-white transition hover:bg-zinc-800"
          onClick={() => setQty(Math.max(1, qty - 1))}
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] border-x border-zinc-700 px-6 py-3 text-center text-sm font-medium tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          className="p-3 text-white transition hover:bg-zinc-800"
          onClick={() => setQty(Math.min(product.stock, qty + 1))}
          aria-label="Increase"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        className="w-full sm:w-auto"
        onClick={() => {
          addItem({
            productId: product.id,
            name: color ? `${product.name} — ${color}` : product.name,
            baseName: product.name,
            price: product.price,
            compareAt: product.compareAt ?? null,
            image:
              colors.find((c) => c.name === color)?.image ?? product.image,
            stock: product.stock,
            quantity: qty,
            color,
            variantOptions: colors.length > 1 ? colors : undefined,
          });
          setAdded(true);
          setTimeout(() => setAdded(false), 2000);
        }}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {added ? "Added!" : "Add to Cart"}
      </Button>
    </div>
  );
}
