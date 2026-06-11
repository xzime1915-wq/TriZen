import { formatCheckoutPrice } from "@/lib/checkout";
import { hasDiscount } from "@/lib/discount";

type Props = {
  price: number;
  compareAt?: number | null;
  quantity?: number;
  size?: "sm" | "md";
};

export function CheckoutItemPrice({
  price,
  compareAt,
  quantity = 1,
  size = "sm",
}: Props) {
  const unitPrice = price;
  const linePrice = price * quantity;
  const unitCompare = compareAt ?? null;
  const lineCompare = unitCompare != null ? unitCompare * quantity : null;
  const showDiscount = hasDiscount(unitPrice, unitCompare);
  const priceClass = size === "md" ? "text-base" : "text-sm";

  return (
    <div className="checkout-item-price">
      <div className="checkout-item-price-row">
        <span className={`checkout-item-price-sale tabular-nums ${priceClass}`}>
          {formatCheckoutPrice(quantity > 1 ? linePrice : unitPrice)}
        </span>
        {showDiscount && lineCompare != null ? (
          <span className="checkout-item-price-compare tabular-nums">
            {formatCheckoutPrice(lineCompare)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
