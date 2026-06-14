"use client";

import { create } from "zustand";
import { useTrackOrderUi } from "@/lib/track-order-ui-store";

type CartUiState = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const useCartUi = create<CartUiState>((set) => ({
  isOpen: false,
  openCart: () => {
    useTrackOrderUi.getState().closeTrackOrder();
    set({ isOpen: true });
  },
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
