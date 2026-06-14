"use client";

import { create } from "zustand";
import { useCartUi } from "@/lib/cart-ui-store";

type TrackOrderUiState = {
  isOpen: boolean;
  initialOrderNumber: string;
  initialEmail: string;
  openTrackOrder: (opts?: { orderNumber?: string; email?: string }) => void;
  closeTrackOrder: () => void;
};

export const useTrackOrderUi = create<TrackOrderUiState>((set) => ({
  isOpen: false,
  initialOrderNumber: "",
  initialEmail: "",
  openTrackOrder: (opts) => {
    useCartUi.getState().closeCart();
    set({
      isOpen: true,
      initialOrderNumber: opts?.orderNumber?.trim() ?? "",
      initialEmail: opts?.email?.trim() ?? "",
    });
  },
  closeTrackOrder: () =>
    set({ isOpen: false, initialOrderNumber: "", initialEmail: "" }),
}));
