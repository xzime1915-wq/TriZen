import Image from "next/image";
import type { ChatMessageDto } from "./chat-types";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatMessageBubble({
  message,
  isOwn,
}: {
  message: ChatMessageDto;
  isOwn: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col max-w-[85%] gap-1",
        isOwn ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div
        className={cn(
          "rounded-sm px-3 py-2 text-sm leading-relaxed border",
          isOwn
            ? "bg-white text-black border-white"
            : "bg-[var(--color-surface-elevated)] text-zinc-100 border-[var(--color-border)]"
        )}
      >
        {message.attachmentType === "image" && message.attachmentUrl && (
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-2"
          >
            <Image
              src={message.attachmentUrl}
              alt="Shared image"
              width={240}
              height={180}
              className="max-h-48 w-auto rounded-sm object-cover"
              unoptimized
            />
          </a>
        )}
        {message.attachmentType === "audio" && message.attachmentUrl && (
          <audio
            controls
            src={message.attachmentUrl}
            className="mb-2 max-w-full h-9"
            preload="metadata"
          />
        )}
        {message.body ? <p className="whitespace-pre-wrap break-words">{message.body}</p> : null}
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
          {formatTime(message.createdAt)}
        </span>
        {isOwn && message.seen && (
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            Seen
          </span>
        )}
      </div>
    </div>
  );
}
