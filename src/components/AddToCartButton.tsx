"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { Button } from "./Button";
import { Minus, Plus, ShoppingCart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export function AddToCartButton({
  product,
  color,
  comingSoon = false,
}: {
  product: Product;
  color?: string;
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
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex items-center border border-[var(--color-border)]">
        <button
          type="button"
          className="p-3 hover:bg-zinc-900"
          onClick={() => setQty(Math.max(1, qty - 1))}
          aria-label="Decrease"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="px-6 py-3 text-sm font-medium min-w-[3rem] text-center">
          {qty}
        </span>
        <button
          type="button"
          className="p-3 hover:bg-zinc-900"
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
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: qty,
            color,
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
