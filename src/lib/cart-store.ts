"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  color?: string;
};

function lineKey(productId: string, color?: string) {
  return color ? `${productId}::${color}` : productId;
}

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string) => void;
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
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((s, i) => s + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "trizen-cart" }
  )
);
