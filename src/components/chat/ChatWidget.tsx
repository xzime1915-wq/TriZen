"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatComposer } from "./ChatComposer";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import type { ChatMessageDto, ChatPresenceMeta } from "./chat-types";
import { applySeenToMessages } from "@/lib/chat-presence";
import { fetchJson } from "@/lib/fetch-json";
import { useChatStore } from "@/lib/chat-store";
import { cn } from "@/lib/utils";

const POLL_MS = 4000;

export function ChatWidget() {
  const open = useChatStore((s) => s.open);
  const setOpen = useChatStore((s) => s.setOpen);
  const toggle = useChatStore((s) => s.toggle);
  const [mounted, setMounted] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageDto[]>([]);
  const prevMessageCountRef = useRef(0);
  messagesRef.current = messages;

  useEffect(() => setMounted(true), []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const applyPresence = useCallback(
    (msgs: ChatMessageDto[], meta?: ChatPresenceMeta) => {
      if (meta) setOtherTyping(meta.otherTyping);
      if (!meta) return msgs;
      return applySeenToMessages(
        msgs,
        "visitor",
        meta.adminLastReadAt,
        meta.visitorLastReadAt
      );
    },
    []
  );

  const loadMessages = useCallback(
    async (convId: string, since?: string) => {
      const q = new URLSearchParams({ conversationId: convId });
      if (since) q.set("since", since);
      const { ok, data } = await fetchJson<{
        messages?: ChatMessageDto[];
        meta?: ChatPresenceMeta;
      }>(`/api/chat/messages?${q}`);
      if (!ok) return;
      const meta = data.meta;

      setMessages((prev) => {
        const incoming = (data.messages ?? []) as ChatMessageDto[];
        const ids = new Set(prev.map((m) => m.id));
        let merged = [...prev];
        let changed = false;
        for (const m of incoming) {
          if (!ids.has(m.id)) {
            merged.push(m);
            changed = true;
          }
        }
        if (changed) {
          merged = merged.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return applyPresence(merged, meta);
      });
    },
    [applyPresence]
  );

  const notifyTyping = useCallback(() => {
    if (!conversationId) return;
    void fetch("/api/chat/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    });
  }, [conversationId]);

  const initChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { ok, data } = await fetchJson<{
      conversation?: {
        id: string;
        visitorName: string;
        visitorEmail: string | null;
      } | null;
      error?: string;
    }>("/api/chat/conversation");

    if (!ok) {
      setError(
        (data as { error?: string }).error ||
          "Chat unavailable. Refresh the page or restart the dev server."
      );
      setShowIntro(true);
      setConversationId(null);
      setLoading(false);
      return;
    }

    if (data.conversation?.id) {
      setConversationId(data.conversation.id);
      setVisitorName(data.conversation.visitorName || "");
      setVisitorEmail(data.conversation.visitorEmail || "");
      setShowIntro(false);
      const { ok: msgOk, data: msgData } = await fetchJson<{
        messages?: ChatMessageDto[];
        meta?: ChatPresenceMeta;
        error?: string;
      }>(`/api/chat/messages?conversationId=${data.conversation.id}`);
      if (msgOk) {
        setMessages(
          applyPresence((msgData.messages ?? []) as ChatMessageDto[], msgData.meta)
        );
        prevMessageCountRef.current = msgData.messages?.length ?? 0;
      } else {
        setMessages([]);
      }
    } else {
      setConversationId(null);
      setShowIntro(true);
      setMessages([]);
    }
    setLoading(false);
  }, [applyPresence]);

  useEffect(() => {
    if (open) void initChat();
  }, [open, initChat]);

  useEffect(() => {
    if (!open || !conversationId || showIntro) return;

    const tick = () => {
      const last = messagesRef.current[messagesRef.current.length - 1];
      void loadMessages(conversationId, last?.createdAt);
    };

    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [open, conversationId, showIntro, loadMessages]);

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  async function startConversation(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { ok, data } = await fetchJson<{
      conversation?: { id: string };
      error?: string;
    }>("/api/chat/conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorName: visitorName.trim() || "Guest",
        visitorEmail: visitorEmail.trim() || undefined,
      }),
    });

    if (!ok || !data.conversation?.id) {
      setError(data.error || "Could not start chat. Try again.");
      setLoading(false);
      return;
    }

    setConversationId(data.conversation.id);
    setShowIntro(false);

    const { ok: msgOk, data: msgData } = await fetchJson<{
      messages?: ChatMessageDto[];
      meta?: ChatPresenceMeta;
    }>(`/api/chat/messages?conversationId=${data.conversation.id}`);

    if (msgOk) {
      setMessages(
        applyPresence((msgData.messages ?? []) as ChatMessageDto[], msgData.meta)
      );
      prevMessageCountRef.current = msgData.messages?.length ?? 0;
    } else {
      setMessages([]);
    }

    setLoading(false);
  }

  async function sendText(body: string) {
    if (!conversationId) return;
    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Send failed");
    setMessages((prev) =>
      applyPresence([...prev, data.message as ChatMessageDto], data.meta)
    );
    scrollToBottom();
  }

  async function uploadFile(file: File) {
    if (!conversationId) return;
    const form = new FormData();
    form.append("file", file);
    form.append("conversationId", conversationId);
    const up = await fetch("/api/chat/upload", { method: "POST", body: form });
    const upData = await up.json();
    if (!up.ok) throw new Error(upData.error || "Upload failed");

    const res = await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        body: file.type.startsWith("audio/") ? "Voice message" : "",
        attachmentUrl: upData.attachmentUrl,
        attachmentType: upData.attachmentType,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Send failed");
    setMessages((prev) =>
      applyPresence([...prev, data.message as ChatMessageDto], data.meta)
    );
    scrollToBottom();
  }

  const panel = open ? (
    <div
      className={cn(
        "trizen-chat-panel w-[min(100vw-2rem,380px)] flex flex-col pointer-events-auto",
        "border border-[var(--color-border)] bg-black shadow-[0_24px_80px_-24px_rgba(0,0,0,0.95)]"
      )}
      role="dialog"
      aria-label="TriZen support chat"
    >
      <header className="shrink-0 flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface-elevated)]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            TriZen Support
          </p>
          <p className="text-sm font-semibold text-white">Live Chat</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-2 text-zinc-500 hover:text-white"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {error && (
        <p className="shrink-0 px-4 py-2 text-xs text-red-400 bg-red-950/40 border-b border-red-900/50">
          {error}
        </p>
      )}

      {showIntro ? (
        <form
          onSubmit={startConversation}
          className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto p-4"
        >
          <p className="text-sm text-zinc-400">
            Start a conversation with our team. We typically reply during business
            hours.
          </p>
          <label className="block text-xs uppercase tracking-wider text-zinc-500">
            Your name
            <input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              required
              autoComplete="name"
              className="trizen-chat-input mt-1 w-full"
              placeholder="Your name"
            />
          </label>
          <label className="block text-xs uppercase tracking-wider text-zinc-500">
            Email (optional)
            <input
              type="email"
              value={visitorEmail}
              onChange={(e) => setVisitorEmail(e.target.value)}
              autoComplete="email"
              className="trizen-chat-input mt-1 w-full"
              placeholder="you@email.com"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="trizen-btn-primary mt-2 shrink-0"
          >
            {loading ? "Starting…" : "Start Chat"}
          </button>
        </form>
      ) : (
        <>
          <div className="trizen-chat-messages flex-1 min-h-0 overflow-y-auto p-4 space-y-3 trizen-chat-scroll">
            {loading && messages.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-8">Loading…</p>
            )}
            {!loading && messages.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-8">
                Say hello — we&apos;re here to help with orders, TriPad, and more.
              </p>
            )}
            {messages.map((m) => (
              <ChatMessageBubble
                key={m.id}
                message={m}
                isOwn={m.sender === "visitor"}
              />
            ))}
            <div ref={bottomRef} />
          </div>
          {otherTyping && (
            <div className="shrink-0 border-t border-[var(--color-border)] bg-black px-4 py-2">
              <ChatTypingIndicator text="typing....." />
            </div>
          )}
          <div className="shrink-0 border-t border-[var(--color-border)] bg-black pointer-events-auto">
            <ChatComposer
              disabled={!conversationId}
              onSendText={sendText}
              onUploadFile={uploadFile}
              onTyping={notifyTyping}
            />
          </div>
        </>
      )}
    </div>
  ) : null;

  return (
    <>
      {mounted &&
        createPortal(
          <div className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end sm:right-6 pointer-events-none">
            {panel}
          </div>,
          document.body
        )}

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "fixed bottom-5 right-4 z-[9999] border-0 bg-transparent p-0 sm:right-6",
          "transition-transform hover:scale-110 active:scale-95",
          open && "scale-0 opacity-0 pointer-events-none"
        )}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <Image
          src="/chat-icon.png"
          alt=""
          width={52}
          height={52}
          className="h-[52px] w-[52px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
          priority
        />
      </button>
    </>
  );
}
