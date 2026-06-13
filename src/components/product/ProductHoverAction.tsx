"use client";

import { useCallback, useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { isProductAvailable, isUpcoming } from "@/lib/product-status";
import { ProductNotifyButton } from "@/components/product/ProductNotifyButton";
import { cn } from "@/lib/utils";

export type ProductHoverData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt?: number | null;
  image: string;
  stock: number;
  tag?: string | null;
};

type Props = {
  product: ProductHoverData;
  className?: string;
};

export function ProductHoverAction({ product, className }: Props) {
  const addItem = useCart((s) => s.addItem);
  const upcoming = isUpcoming(product.tag);
  const available = isProductAvailable(product);
  const [added, setAdded] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!upcoming) return;
    let active = true;

    fetch(`/api/products/${product.slug}/notify`)
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        if (data.subscribed) setSubscribed(true);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [product.slug, upcoming]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (upcoming) {
        if (!subscribed) setNotifyOpen(true);
        return;
      }

      if (!available) return;

      addItem({
        productId: product.id,
        name: product.name,
        baseName: product.name,
        price: product.price,
        compareAt: product.compareAt ?? null,
        image: product.image,
        stock: product.stock,
        quantity: 1,
      });
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    },
    [addItem, available, product, subscribed, upcoming]
  );

  const label = upcoming
    ? subscribed
      ? "On the list"
      : "Notify me"
    : added
      ? "Added"
      : available
        ? "Add to cart"
        : "Out of stock";

  const disabled = upcoming ? subscribed : !available;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn("trizen-product-hover-action", className)}
        aria-label={label}
      >
        {label}
      </button>

      {upcoming ? (
        <ProductNotifyButton
          productSlug={product.slug}
          productName={product.name}
          hideTrigger
          open={notifyOpen}
          onOpenChange={setNotifyOpen}
          onSubscribed={() => setSubscribed(true)}
        />
      ) : null}
    </>
  );
}
