"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart, type CartItem } from "@/lib/cart-store";
import { CheckoutItemPrice } from "@/components/checkout/CheckoutItemPrice";
import { CheckoutStyleSelect } from "@/components/checkout/CheckoutStyleSelect";
import { discountPercent } from "@/lib/discount";
import { displayImageSrc } from "@/lib/image-path";
import { editionLabelFromName } from "@/lib/product-edition";
import type { ProductColor } from "@/lib/product-data";

type EditionOption = {
  productId: string;
  label: string;
  name: string;
  baseName: string;
  price: number;
  compareAt: number | null;
  image: string;
  stock: number;
  colors: ProductColor[];
};

function displayName(item: CartItem) {
  return item.baseName ?? item.name.split(" — ")[0] ?? item.name;
}

export function CheckoutCartItemCard({ item }: { item: CartItem }) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const replaceEdition = useCart((s) => s.replaceEdition);
  const [editions, setEditions] = useState<EditionOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState(
    item.color ?? editionLabelFromName(item.name)
  );

  useEffect(() => {
    fetch(`/api/checkout/editions?productId=${encodeURIComponent(item.productId)}`)
      .then((r) => r.json())
      .then((data: { editions?: EditionOption[] }) => {
        const list = data.editions ?? [];
        setEditions(list);
        const current = list.find((e) => e.productId === item.productId);
        if (current) setSelectedLabel(current.label);
      })
      .catch(() => setEditions([]));
  }, [item.productId]);

  const styleOptions: ProductColor[] =
    editions.length > 0
      ? editions.map((e) => ({ name: e.label, image: e.image }))
      : [{ name: item.color ?? editionLabelFromName(item.name) }];

  const pct = discountPercent(item.price, item.compareAt);
  const title = displayName(item);

  function handleEditionChange(label: string) {
    setSelectedLabel(label);
    const edition = editions.find((e) => e.label === label);
    if (!edition || edition.productId === item.productId) return;

    replaceEdition(item.productId, item.color, {
      productId: edition.productId,
      name: edition.name,
      baseName: edition.baseName,
      price: edition.price,
      compareAt: edition.compareAt,
      image: edition.image,
      stock: edition.stock,
      color: edition.label,
      variantOptions:
        edition.colors.length > 1
          ? edition.colors
          : editions.length > 1
            ? editions.map((e) => ({ name: e.label, image: e.image }))
            : undefined,
    });
  }

  function handleAdd() {
    updateQuantity(item.productId, item.quantity + 1, item.color);
  }

  return (
    <div className="checkout-upsell-box">
      <div className="flex gap-3">
        <div className="checkout-sidebar-thumb shrink-0">
          <Image
            src={displayImageSrc(item.image)}
            alt={item.name}
            fill
            className="object-contain p-1.5"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-zinc-900">
            {title}
            {pct != null ? (
              <span className="checkout-discount-badge checkout-discount-badge--inline">
                {pct}% OFF
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">{selectedLabel}</p>
          <div className="mt-1.5">
            <CheckoutItemPrice price={item.price} compareAt={item.compareAt} />
          </div>
        </div>
      </div>

      <div className="checkout-upsell-actions">
        <CheckoutStyleSelect
          options={styleOptions}
          value={selectedLabel}
          onChange={handleEditionChange}
        />
        <div className="checkout-action-box checkout-upsell-add-box">
          <button
            type="button"
            onClick={handleAdd}
            disabled={item.quantity >= item.stock}
            className="checkout-upsell-add"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
