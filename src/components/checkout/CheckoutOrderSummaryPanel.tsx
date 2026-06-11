"use client";

import Image from "next/image";
import { displayImageSrc } from "@/lib/image-path";
import { formatCheckoutPrice } from "@/lib/checkout";
import { discountPercent } from "@/lib/discount";
import type { CartItem } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

type Props = {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  className?: string;
};

function displayName(item: CartItem) {
  return item.baseName ?? item.name.split(" — ")[0] ?? item.name;
}

function SummaryLine({ item }: { item: CartItem }) {
  const pct = discountPercent(item.price, item.compareAt);
  const title = displayName(item);

  return (
    <li className="checkout-sidebar-item">
      <div className="checkout-sidebar-thumb-wrap">
        <div className="checkout-sidebar-thumb">
          <Image
            src={displayImageSrc(item.image)}
            alt={item.name}
            fill
            className="object-contain p-1.5"
            sizes="64px"
          />
        </div>
        <span className="checkout-sidebar-qty" aria-label={`Quantity ${item.quantity}`}>
          {item.quantity}
        </span>
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
        {item.color ? (
          <p className="mt-0.5 text-xs text-zinc-500">{item.color}</p>
        ) : null}
      </div>
      <p className="shrink-0 self-start text-sm font-medium tabular-nums text-zinc-900">
        {formatCheckoutPrice(item.price * item.quantity)}
      </p>
    </li>
  );
}

export function CheckoutOrderSummaryPanel({
  items,
  subtotal,
  deliveryCharge,
  total,
  className,
}: Props) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={cn("checkout-order-summary-panel", className)}>
      <h2 className="checkout-order-summary-title">Order summary</h2>

      <ul className="checkout-sidebar-items">
        {items.map((item) => (
          <SummaryLine
            key={`${item.productId}${item.color ? `-${item.color}` : ""}`}
            item={item}
          />
        ))}
      </ul>

      <div className="checkout-sidebar-totals">
        <div className="checkout-sidebar-row">
          <span>
            Subtotal
            {itemCount > 0 ? (
              <span className="text-zinc-400"> · {itemCount} item{itemCount !== 1 ? "s" : ""}</span>
            ) : null}
          </span>
          <span className="tabular-nums text-zinc-900">{formatCheckoutPrice(subtotal)}</span>
        </div>
        <div className="checkout-sidebar-row">
          <span>Delivery</span>
          <span className="tabular-nums text-zinc-900">{formatCheckoutPrice(deliveryCharge)}</span>
        </div>
        <div className="checkout-sidebar-total">
          <span className="checkout-sidebar-total-label">Total</span>
          <span className="tabular-nums">
            <span className="checkout-sidebar-total-currency">BDT </span>
            <span className="checkout-sidebar-total-amount">
              {formatCheckoutPrice(total)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
