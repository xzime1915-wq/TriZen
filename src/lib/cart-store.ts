"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductColor } from "@/lib/product-data";

export type CartItem = {
  productId: string;
  name: string;
  baseName?: string;
  price: number;
  compareAt?: number | null;
  image: string;
  quantity: number;
  stock: number;
  color?: string;
  variantOptions?: ProductColor[];
};

function lineKey(productId: string, color?: string) {
  return color ? `${productId}::${color}` : productId;
}

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
  updateVariant: (productId: string, oldColor: string | undefined, newColor: string) => void;
  replaceEdition: (
    fromProductId: string,
    fromColor: string | undefined,
    to: Omit<CartItem, "quantity">
  ) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        set((state) => {
          const key = lineKey(item.productId, item.color);
          const existing = state.items.find(
            (i) => lineKey(i.productId, i.color) === key
          );
          const qty = item.quantity ?? 1;
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.color) === key
                  ? { ...i, quantity: Math.min(i.quantity + qty, item.stock) }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(qty, item.stock) },
            ],
          };
        });
      },
      removeItem: (productId, color?: string) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.productId, i.color) !== lineKey(productId, color)
          ),
        })),
      updateQuantity: (productId, quantity, color?: string) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.productId, i.color) === lineKey(productId, color)
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      updateVariant: (productId, oldColor, newColor) =>
        set((state) => {
          const fromKey = lineKey(productId, oldColor);
          const item = state.items.find((i) => lineKey(i.productId, i.color) === fromKey);
          if (!item?.variantOptions?.length) return state;

          const option = item.variantOptions.find((v) => v.name === newColor);
          if (!option || option.name === item.color) return state;

          const toKey = lineKey(productId, newColor);
          const existing = state.items.find((i) => lineKey(i.productId, i.color) === toKey);
          const base = item.baseName ?? item.name.split(" — ")[0] ?? item.name;
          const nextLine: CartItem = {
            ...item,
            color: newColor,
            baseName: base,
            name: `${base} — ${newColor}`,
            image: option.image ?? item.image,
          };

          if (existing && lineKey(existing.productId, existing.color) !== fromKey) {
            return {
              items: state.items
                .filter((i) => lineKey(i.productId, i.color) !== fromKey)
                .map((i) =>
                  lineKey(i.productId, i.color) === toKey
                    ? {
                        ...i,
                        quantity: Math.min(i.quantity + item.quantity, i.stock),
                      }
                    : i
                ),
            };
          }

          return {
            items: state.items.map((i) =>
              lineKey(i.productId, i.color) === fromKey ? nextLine : i
            ),
          };
        }),
      replaceEdition: (fromProductId, fromColor, to) =>
        set((state) => {
          const fromKey = lineKey(fromProductId, fromColor);
          const item = state.items.find((i) => lineKey(i.productId, i.color) === fromKey);
          if (!item) return state;

          const qty = item.quantity;
          const toKey = lineKey(to.productId, to.color);
          const existing = state.items.find((i) => lineKey(i.productId, i.color) === toKey);
          const nextQty = Math.min(qty, to.stock);

          if (existing && lineKey(existing.productId, existing.color) !== fromKey) {
            return {
              items: state.items
                .filter((i) => lineKey(i.productId, i.color) !== fromKey)
                .map((i) =>
                  lineKey(i.productId, i.color) === toKey
                    ? {
                        ...i,
                        ...to,
                        quantity: Math.min(i.quantity + nextQty, to.stock),
                      }
                    : i
                ),
            };
          }

          return {
            items: state.items.map((i) =>
              lineKey(i.productId, i.color) === fromKey
                ? { ...to, quantity: nextQty }
                : i
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "trizen-cart" }
  )
);
