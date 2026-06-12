export function isUpcoming(tag: string | null | undefined): boolean {
  if (!tag) return false;
  const t = tag.toLowerCase();
  return t.includes("upcoming") || t.includes("coming soon");
}

/** @deprecated Use isUpcoming */
export const isComingSoon = isUpcoming;

/** Upcoming products have no public price until launch. */
export function shouldShowProductPrice(tag: string | null | undefined): boolean {
  return !isUpcoming(tag);
}

export function isProductAvailable(product: {
  tag?: string | null;
  stock: number;
  price: number;
}): boolean {
  return !isUpcoming(product.tag) && product.stock > 0 && product.price > 0;
}
