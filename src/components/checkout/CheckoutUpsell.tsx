"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-store";
import type { CheckoutUpsellItem } from "@/lib/checkout-upsell";
import { CheckoutItemPrice } from "@/components/checkout/CheckoutItemPrice";
import { CheckoutStyleSelect } from "@/components/checkout/CheckoutStyleSelect";
import { discountPercent } from "@/lib/discount";
import { displayImageSrc } from "@/lib/image-path";

function UpsellCard({
  product,
  headline,
}: {
  product: CheckoutUpsellItem;
  headline?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const options =
    product.colors.length > 0 ? product.colors : [{ name: "Standard" }];
  const [selectedColor, setSelectedColor] = useState(options[0]?.name ?? "");
  const [added, setAdded] = useState(false);

  const colorOption = product.colors.find((c) => c.name === selectedColor);
  const image = colorOption?.image ?? product.image;
  const pct = discountPercent(product.price, product.compareAt);

  function handleAdd() {
    const color =
      product.colors.length > 1
        ? selectedColor
        : product.colors[0]?.name;
    addItem({
      productId: product.id,
      name: color ? `${product.name} — ${color}` : product.name,
      baseName: product.name,
      price: product.price,
      compareAt: product.compareAt,
      image,
      stock: product.stock,
      color,
      variantOptions: product.colors.length > 1 ? product.colors : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="checkout-upsell-box">
      {headline ? <p className="checkout-upsell-lead">{headline}</p> : null}

      <div className="flex gap-3">
        <div className="checkout-sidebar-thumb shrink-0">
          <Image
            src={displayImageSrc(image)}
            alt={product.name}
            fill
            className="object-contain p-1.5"
            sizes="64px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug text-zinc-900">
            {product.name}
            {pct != null ? (
              <span className="checkout-discount-badge checkout-discount-badge--inline">
                {pct}% OFF
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500">{selectedColor}</p>
          <div className="mt-1.5">
            <CheckoutItemPrice price={product.price} compareAt={product.compareAt} />
          </div>
        </div>
      </div>

      <div className="checkout-upsell-actions">
        <CheckoutStyleSelect
          options={options}
          value={selectedColor}
          onChange={setSelectedColor}
        />
        <div className="checkout-action-box checkout-upsell-add-box">
          <button
            type="button"
            onClick={handleAdd}
            disabled={added}
            className="checkout-upsell-add"
          >
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CheckoutUpsell() {
  const cartItems = useCart((s) => s.items);
  const [items, setItems] = useState<CheckoutUpsellItem[]>([]);
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    const exclude = cartItems.map((i) => i.productId).join(",");
    fetch(`/api/checkout/upsell?exclude=${encodeURIComponent(exclude)}`)
      .then((r) => r.json())
      .then((data: { items?: CheckoutUpsellItem[] }) => {
        const list = data.items ?? [];
        setItems(list);
        setHeadline(list[0]?.headline ?? "");
      })
      .catch(() => {
        setItems([]);
        setHeadline("");
      });
  }, [cartItems]);

  if (items.length === 0) return null;

  return (
    <section className="checkout-upsell" aria-label="Recommended add-ons">
      <div className="checkout-upsell-list">
        {items.map((product, index) => (
          <UpsellCard
            key={product.id}
            product={product}
            headline={index === 0 ? headline : undefined}
          />
        ))}
      </div>
    </section>
  );
}
