"use client";

import { create } from "zustand";

type NewsletterUiState = {
  isOpen: boolean;
  openNewsletter: () => void;
  closeNewsletter: () => void;
};

export const useNewsletterUi = create<NewsletterUiState>((set) => ({
  isOpen: false,
  openNewsletter: () => set({ isOpen: true }),
  closeNewsletter: () => set({ isOpen: false }),
}));
