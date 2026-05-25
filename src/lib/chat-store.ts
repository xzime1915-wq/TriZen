import { create } from "zustand";

type ChatStore = {
  open: boolean;
  unreadCount: number;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  clearUnread: () => void;
  addUnread: (count?: number) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  open: false,
  unreadCount: 0,
  setOpen: (open) =>
    set((s) => ({
      open,
      unreadCount: open ? 0 : s.unreadCount,
    })),
  toggle: () =>
    set((s) => ({
      open: !s.open,
      unreadCount: !s.open ? 0 : s.unreadCount,
    })),
  clearUnread: () => set({ unreadCount: 0 }),
  addUnread: (count = 1) =>
    set((s) => ({ unreadCount: s.unreadCount + count })),
}));
