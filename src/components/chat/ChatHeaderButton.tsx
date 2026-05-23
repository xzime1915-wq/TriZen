"use client";

import { MessageCircle } from "lucide-react";
import { useChatStore } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function ChatHeaderButton({ className }: Props) {
  const toggle = useChatStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={toggle}
      className={className}
      aria-label="Open live chat"
    >
      <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.5} />
    </button>
  );
}
