"use client";

import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function ChatHeaderButton({ className }: Props) {
  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(className, "relative")}
      aria-label={
        unreadCount > 0 ? `Open live chat, ${unreadCount} new` : "Open live chat"
      }
    >
      <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
      {unreadCount > 0 && (
        <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-white ring-2 ring-black" />
      )}
    </button>
  );
}
