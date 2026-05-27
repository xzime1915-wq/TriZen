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
import {
  playChatSound,
  requestChatNotificationPermission,
  showChatNotification,
} from "@/lib/chat-notify";
import { cn } from "@/lib/utils";

const POLL_MS = 4000;

export function ChatWidget() {
  const open = useChatStore((s) => s.open);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const setOpen = useChatStore((s) => s.setOpen);
  const addUnread = useChatStore((s) => s.addUnread);
  const clearUnread = useChatStore((s) => s.clearUnread);
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
  const knownMessageIdsRef = useRef(new Set<string>());
  const openRef = useRef(open);
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);
  messagesRef.current = messages;
  openRef.current = open;

  const closeChat = useCallback(() => setOpen(false), [setOpen]);

  const openChat = useCallback(() => {
    void requestChatNotificationPermission();
    setOpen(true);
  }, [setOpen]);

  const notifyIncomingAdmin = useCallback(
    (incoming: ChatMessageDto[]) => {
      const fresh = incoming.filter(
        (m) => m.sender === "admin" && !knownMessageIdsRef.current.has(m.id)
      );
      if (fresh.length === 0) return;

      for (const m of fresh) knownMessageIdsRef.current.add(m.id);

      playChatSound();

      const preview =
        fresh[fresh.length - 1].body?.trim() ||
        (fresh[fresh.length - 1].attachmentUrl ? "Sent an attachment" : "New message");

      if (!openRef.current || document.visibilityState === "hidden") {
        addUnread(fresh.length);
        showChatNotification("TriZen Support", preview, () => setOpen(true));
      }
    },
    [addUnread, setOpen]
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) clearUnread();
  }, [open, clearUnread]);

  useEffect(() => {
    if (open) {
      setPanelMounted(true);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPanelEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setPanelEntered(false);
  }, [open]);

  useEffect(() => {
    if (!open && panelMounted) {
      const t = window.setTimeout(() => setPanelMounted(false), 320);
      return () => window.clearTimeout(t);
    }
  }, [open, panelMounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

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
          notifyIncomingAdmin(incoming);
        }
        return applyPresence(merged, meta);
      });
    },
    [applyPresence, notifyIncomingAdmin]
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
        const initial = (msgData.messages ?? []) as ChatMessageDto[];
        for (const m of initial) knownMessageIdsRef.current.add(m.id);
        setMessages(applyPresence(initial, msgData.meta));
        prevMessageCountRef.current = initial.length;
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
    void initChat();
  }, [initChat]);

  useEffect(() => {
    if (open) void initChat();
  }, [open, initChat]);

  useEffect(() => {
    if (!conversationId || showIntro) return;

    const tick = () => {
      const last = messagesRef.current[messagesRef.current.length - 1];
      void loadMessages(conversationId, last?.createdAt);
    };

    tick();
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
  }, [conversationId, showIntro, loadMessages]);

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
    void requestChatNotificationPermission();

    const { ok: msgOk, data: msgData } = await fetchJson<{
      messages?: ChatMessageDto[];
      meta?: ChatPresenceMeta;
    }>(`/api/chat/messages?conversationId=${data.conversation.id}`);

    if (msgOk) {
      const initial = (msgData.messages ?? []) as ChatMessageDto[];
      knownMessageIdsRef.current = new Set(initial.map((m) => m.id));
      setMessages(applyPresence(initial, msgData.meta));
      prevMessageCountRef.current = initial.length;
    } else {
      setMessages([]);
      knownMessageIdsRef.current = new Set();
    }

    setLoading(false);
  }

  async function sendText(body: string) {
    if (!conversationId) {
      setError("Chat session expired. Close the chat and open it again.");
      return;
    }
    setError(null);
    const { ok, data } = await fetchJson<{
      message?: ChatMessageDto;
      meta?: ChatPresenceMeta;
      error?: string;
    }>("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, body }),
    });
    if (!ok || !data.message) {
      const msg = data.error || "Message could not be sent. Try again.";
      setError(msg);
      throw new Error(msg);
    }
    setMessages((prev) =>
      applyPresence([...prev, data.message as ChatMessageDto], data.meta)
    );
    scrollToBottom();
  }

  async function uploadFile(file: File) {
    if (!conversationId) {
      setError("Chat session expired. Close the chat and open it again.");
      return;
    }
    setError(null);
    const form = new FormData();
    form.append("file", file);
    form.append("conversationId", conversationId);
    const up = await fetch("/api/chat/upload", { method: "POST", body: form });
    const upData = await up.json();
    if (!up.ok) throw new Error(upData.error || "Upload failed");

    const { ok, data } = await fetchJson<{
      message?: ChatMessageDto;
      meta?: ChatPresenceMeta;
      error?: string;
    }>("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        body: file.type.startsWith("audio/") ? "Voice message" : "",
        attachmentUrl: upData.attachmentUrl,
        attachmentType: upData.attachmentType,
      }),
    });
    if (!ok || !data.message) {
      const msg = data.error || "Message could not be sent. Try again.";
      setError(msg);
      throw new Error(msg);
    }
    setMessages((prev) =>
      applyPresence([...prev, data.message as ChatMessageDto], data.meta)
    );
    scrollToBottom();
  }

  const panel = panelMounted ? (
    <div
      className={cn(
        "trizen-chat-panel w-[min(100vw-2rem,380px)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.95)]",
        panelEntered ? "trizen-chat-panel--open" : "trizen-chat-panel--closed"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="TriZen support chat"
    >
      <header className="shrink-0 flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3 bg-[var(--color-surface-elevated)]">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            TriZen Support
          </p>
          <p className="text-sm font-semibold text-[var(--color-foreground)]">Live Chat</p>
        </div>
        <button
          type="button"
          onClick={closeChat}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-[var(--color-border)] bg-white/70 text-zinc-400 transition-colors hover:border-zinc-500 hover:bg-zinc-100 hover:text-[var(--color-foreground)]"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" strokeWidth={2} />
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
            <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2">
              <ChatTypingIndicator text="typing....." />
            </div>
          )}
          <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-surface)] pointer-events-auto">
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
        panelMounted &&
        createPortal(
          <>
            <button
              type="button"
              className={cn(
                "trizen-chat-backdrop z-[9998]",
                panelEntered
                  ? "trizen-chat-backdrop--visible"
                  : "trizen-chat-backdrop--hidden"
              )}
              aria-label="Close chat"
              onClick={closeChat}
            />
            <div className="pointer-events-none fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-[9999] flex flex-col items-end sm:right-6 lg:bottom-5">
              {panel}
            </div>
          </>,
          document.body
        )}

      <button
        type="button"
        onClick={() => (open ? closeChat() : openChat())}
        className={cn(
          "trizen-chat-fab fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-[9999] border-0 bg-transparent p-0 sm:right-6 lg:bottom-5",
          "hover:scale-110 active:scale-95",
          open ? "trizen-chat-fab--hidden" : "trizen-chat-fab--visible"
        )}
        aria-label={
          unreadCount > 0 ? `Open chat, ${unreadCount} new messages` : "Open chat"
        }
      >
        <span className="relative block">
          <Image
            src="/chat-icon.png"
            alt=""
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            priority
          />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      </button>
    </>
  );
}
