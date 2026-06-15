"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import type { CheckoutUpsellItem } from "@/lib/checkout-upsell";
import { formatCurrency } from "@/lib/utils";
import { displayImageSrc } from "@/lib/image-path";

function CartUpsellCard({ product }: { product: CheckoutUpsellItem }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const defaultColor = product.colors[0]?.name;
  const image = product.colors[0]?.image ?? product.image;

  function handleAdd() {
    addItem({
      productId: product.id,
      name: defaultColor ? `${product.name}, ${defaultColor}` : product.name,
      baseName: product.name,
      price: product.price,
      compareAt: product.compareAt,
      image,
      stock: product.stock,
      color: defaultColor,
      variantOptions: product.colors.length > 1 ? product.colors : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <article className="cart-upsell-card">
      <div className="cart-upsell-card-thumb">
        <Image
          src={displayImageSrc(image)}
          alt={product.name}
          fill
          className="object-contain p-1.5"
          sizes="72px"
        />
      </div>
      <div className="cart-upsell-card-body">
        <p className="cart-upsell-card-name">{product.name}</p>
        <p className="cart-upsell-card-price">{formatCurrency(product.price)}</p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={added}
          className="cart-upsell-card-add"
        >
          {added ? "Added" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

export function CartUpsell() {
  const cartItems = useCart((s) => s.items);
  const [items, setItems] = useState<CheckoutUpsellItem[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const exclude = cartItems.map((i) => i.productId).join(",");
    fetch(
      `/api/checkout/upsell?exclude=${encodeURIComponent(exclude)}&limit=6&context=cart`,
    )
      .then((r) => r.json())
      .then((data: { items?: CheckoutUpsellItem[] }) => {
        setItems(data.items ?? []);
      })
      .catch(() => setItems([]));
  }, [cartItems]);

  function scroll(dir: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".cart-upsell-card");
    const step = card ? card.offsetWidth + 10 : track.clientWidth * 0.85;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="cart-upsell" aria-label="You may also like">
      <div className="cart-upsell-header">
        <h3 className="cart-upsell-title">You may also like</h3>
        {items.length > 1 ? (
          <div className="cart-upsell-nav">
            <button
              type="button"
              className="cart-upsell-nav-btn"
              onClick={() => scroll(-1)}
              aria-label="Scroll recommendations left"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="cart-upsell-nav-btn"
              onClick={() => scroll(1)}
              aria-label="Scroll recommendations right"
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          </div>
        ) : null}
      </div>
      <div ref={trackRef} className="cart-upsell-track" data-lenis-prevent>
        {items.map((product) => (
          <CartUpsellCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
