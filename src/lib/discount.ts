export function discountPercent(
  price: number,
  compareAt?: number | null
): number | null {
  if (compareAt == null || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function hasDiscount(price: number, compareAt?: number | null): boolean {
  return compareAt != null && compareAt > price;
}
