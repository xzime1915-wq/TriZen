"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessageBubble } from "@/components/chat/ChatMessageBubble";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatTypingIndicator } from "@/components/chat/ChatTypingIndicator";
import type {
  ChatConversationSummary,
  ChatMessageDto,
  ChatPresenceMeta,
} from "@/components/chat/chat-types";
import { applySeenToMessages } from "@/lib/chat-presence";
import {
  playChatSound,
  requestChatNotificationPermission,
  showChatNotification,
} from "@/lib/chat-notify";
import { cn } from "@/lib/utils";

const POLL_MS = 3000;

export function AdminChat() {
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessageDto[]>([]);
  const knownMessageIdsRef = useRef(new Set<string>());
  const prevUnreadTotalRef = useRef(0);
  messagesRef.current = messages;

  const selected = conversations.find((c) => c.id === selectedId);

  const applyPresence = useCallback(
    (msgs: ChatMessageDto[], meta?: ChatPresenceMeta) => {
      if (meta) setOtherTyping(meta.otherTyping);
      if (!meta) return msgs;
      return applySeenToMessages(
        msgs,
        "admin",
        meta.adminLastReadAt,
        meta.visitorLastReadAt
      );
    },
    []
  );

  const mergePollData = useCallback(
    (prev: ChatMessageDto[], incoming: ChatMessageDto[], meta?: ChatPresenceMeta) => {
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
        const freshVisitor = incoming.filter(
          (m) =>
            m.sender === "visitor" && !knownMessageIdsRef.current.has(m.id)
        );
        for (const m of freshVisitor) knownMessageIdsRef.current.add(m.id);
        if (freshVisitor.length > 0) {
          playChatSound();
          const last = freshVisitor[freshVisitor.length - 1];
          const preview =
            last.body?.trim() ||
            (last.attachmentUrl ? "Customer sent an attachment" : "New message");
          showChatNotification("Live Chat", preview);
        }
      }
      return applyPresence(merged, meta);
    },
    [applyPresence]
  );

  const loadConversations = useCallback(async () => {
    const res = await fetch("/api/admin/chat/conversations");
    if (!res.ok) return;
    const data = await res.json();
    setConversations(data.conversations ?? []);
    setLoadingList(false);
  }, []);

  const loadThread = useCallback(async (id: string, replace = true) => {
    setLoadingThread(replace);
    const res = await fetch(`/api/admin/chat/conversations/${id}/messages`);
    if (!res.ok) {
      setLoadingThread(false);
      return;
    }
    const data = await res.json();
    const meta = data.meta as ChatPresenceMeta | undefined;
    if (replace) {
      const initial = (data.messages ?? []) as ChatMessageDto[];
      knownMessageIdsRef.current = new Set(initial.map((m) => m.id));
      setMessages(applyPresence(initial, meta));
    } else {
      setMessages((prev) =>
        mergePollData(prev, (data.messages ?? []) as ChatMessageDto[], meta)
      );
    }
    setLoadingThread(false);
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    void requestChatNotificationPermission();
    void loadConversations();
    const id = setInterval(() => void loadConversations(), POLL_MS);
    return () => clearInterval(id);
  }, [loadConversations, applyPresence, mergePollData]);

  const totalUnread = conversations.reduce((n, c) => n + (c.unreadAdmin ?? 0), 0);

  useEffect(() => {
    if (totalUnread > prevUnreadTotalRef.current) {
      const external = conversations.filter(
        (c) => (c.unreadAdmin ?? 0) > 0 && c.id !== selectedId
      );
      if (external.length > 0) {
        playChatSound();
        const top = external[0];
        if (document.visibilityState === "hidden") {
          showChatNotification(
            "New chat message",
            `${top.visitorName}: ${top.lastMessage?.body || "New message"}`
          );
        }
      }
    }
    prevUnreadTotalRef.current = totalUnread;
  }, [totalUnread, conversations, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setOtherTyping(false);
      return;
    }
    void loadThread(selectedId);
    const id = setInterval(() => {
      const last = messagesRef.current[messagesRef.current.length - 1];
      const q = last
        ? `?since=${encodeURIComponent(last.createdAt)}`
        : "";
      void fetch(`/api/admin/chat/conversations/${selectedId}/messages${q}`)
        .then((r) => r.json())
        .then((data) => {
          setMessages((prev) =>
            mergePollData(
              prev,
              (data.messages ?? []) as ChatMessageDto[],
              data.meta as ChatPresenceMeta | undefined
            )
          );
          void loadConversations();
        });
    }, POLL_MS);
    return () => clearInterval(id);
  }, [selectedId, loadThread, loadConversations, mergePollData]);

  const prevCountRef = useRef(0);
  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevCountRef.current = messages.length;
  }, [messages.length, selectedId]);

  async function sendText(body: string) {
    if (!selectedId) return;
    const res = await fetch(`/api/admin/chat/conversations/${selectedId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Send failed");
    setMessages((prev) =>
      applyPresence([...prev, data.message as ChatMessageDto], data.meta)
    );
    void loadConversations();
  }

  async function uploadFile(file: File) {
    if (!selectedId) return;
    const form = new FormData();
    form.append("file", file);
    form.append("conversationId", selectedId);
    const up = await fetch("/api/admin/chat/upload", { method: "POST", body: form });
    const upData = await up.json();
    if (!up.ok) throw new Error(upData.error || "Upload failed");

    const res = await fetch(`/api/admin/chat/conversations/${selectedId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
    void loadConversations();
  }

  const notifyTyping = useCallback(() => {
    if (!selectedId) return;
    void fetch(`/api/admin/chat/conversations/${selectedId}/typing`, {
      method: "POST",
    });
  }, [selectedId]);

  async function toggleStatus() {
    if (!selectedId || !selected) return;
    const next = selected.status === "open" ? "closed" : "open";
    await fetch(`/api/admin/chat/conversations/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    void loadConversations();
    void loadThread(selectedId, false);
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-0 border border-[var(--color-border)] min-h-[calc(100vh-8rem)] bg-black">
      <aside className="border-b lg:border-b-0 lg:border-r border-[var(--color-border)] flex flex-col max-h-[40vh] lg:max-h-none">
        <div className="p-4 border-b border-[var(--color-border)]">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            Inbox
          </h2>
          {totalUnread > 0 && (
            <p className="text-xs text-zinc-500 mt-1">{totalUnread} unread</p>
          )}
        </div>
        <div className="overflow-y-auto flex-1 trizen-chat-scroll">
          {loadingList && (
            <p className="p-4 text-sm text-zinc-500">Loading…</p>
          )}
          {!loadingList && conversations.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelectedId(c.id);
                setMessages([]);
                knownMessageIdsRef.current = new Set();
                void loadThread(c.id);
              }}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-[var(--color-border)] transition-colors",
                selectedId === c.id
                  ? "bg-white text-black"
                  : "hover:bg-zinc-900 text-zinc-300"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm truncate">{c.visitorName}</span>
                {(c.unreadAdmin ?? 0) > 0 && (
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-sm",
                      selectedId === c.id ? "bg-black text-white" : "bg-white text-black"
                    )}
                  >
                    {c.unreadAdmin}
                  </span>
                )}
              </div>
              {c.visitorEmail && (
                <p
                  className={cn(
                    "text-xs truncate mt-0.5",
                    selectedId === c.id ? "text-zinc-600" : "text-zinc-600"
                  )}
                >
                  {c.visitorEmail}
                </p>
              )}
              {c.lastMessage && (
                <p
                  className={cn(
                    "text-xs truncate mt-1",
                    selectedId === c.id ? "text-zinc-700" : "text-zinc-500"
                  )}
                >
                  {c.lastMessage.body || "[Attachment]"}
                </p>
              )}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex flex-col min-h-[50vh] lg:min-h-0 overflow-hidden">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center p-8 text-zinc-500 text-sm">
            Select a conversation to reply
          </div>
        ) : (
          <>
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
              <div>
                <p className="font-semibold text-white">{selected?.visitorName}</p>
                {selected?.visitorEmail && (
                  <p className="text-xs text-zinc-500">{selected.visitorEmail}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void toggleStatus()}
                className="text-xs uppercase tracking-wider border border-[var(--color-border)] px-3 py-1.5 hover:bg-zinc-900"
              >
                {selected?.status === "open" ? "Close chat" : "Reopen chat"}
              </button>
            </header>

            <div className="trizen-chat-messages flex-1 min-h-0 overflow-y-auto p-4 space-y-3 trizen-chat-scroll">
              {loadingThread && messages.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-8">Loading…</p>
              )}
              {messages.map((m) => (
                <ChatMessageBubble
                  key={m.id}
                  message={m}
                  isOwn={m.sender === "admin"}
                />
              ))}
              <div ref={bottomRef} />
            </div>

            {otherTyping && (
              <div className="shrink-0 border-t border-[var(--color-border)] bg-black px-4 py-2">
                <ChatTypingIndicator
                  text={`${selected?.visitorName ?? "Customer"} is typing.....`}
                />
              </div>
            )}
            <div className="shrink-0 relative z-10 bg-black border-t border-[var(--color-border)]">
              <ChatComposer
                disabled={selected?.status === "closed"}
                placeholder={
                  selected?.status === "closed"
                    ? "Reopen chat to reply"
                    : "Reply to customer…"
                }
                onSendText={sendText}
                onUploadFile={uploadFile}
                onTyping={notifyTyping}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
