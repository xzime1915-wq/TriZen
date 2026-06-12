"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  playChatSound,
  requestChatNotificationPermission,
  showChatNotification,
} from "@/lib/chat-notify";

const POLL_MS = 15_000;

type AlertOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
};

/** Browser alerts while admin is open; WhatsApp is configured in .env (see Settings). */
export function AdminAlerts() {
  const sinceRef = useRef<string | null>(null);
  const knownOrderIdsRef = useRef(new Set<string>());
  const prevChatUnreadRef = useRef(0);
  const initializedRef = useRef(false);
  const [whatsappOk, setWhatsappOk] = useState<boolean | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );
  const [dismissedBanner, setDismissedBanner] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/whatsapp")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setWhatsappOk(d?.configured ?? false))
      .catch(() => setWhatsappOk(false));

    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermission("unsupported");
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const poll = useCallback(async () => {
    const since = sinceRef.current ?? new Date().toISOString();
    if (!sinceRef.current) sinceRef.current = since;

    const res = await fetch(`/api/admin/alerts?since=${encodeURIComponent(since)}`);
    if (!res.ok) return;

    const data = await res.json();
    const orders = (data.orders ?? []) as AlertOrder[];
    const chatUnread = (data.chatUnread ?? 0) as number;

    for (const o of orders) {
      if (knownOrderIdsRef.current.has(o.id)) continue;
      knownOrderIdsRef.current.add(o.id);
      if (!initializedRef.current) continue;
      playChatSound();
      showChatNotification(
        "New order",
        `${o.orderNumber}, ${o.customerName} · ৳${o.total}`,
        () => {
          window.location.href = `/admin/orders/${o.id}`;
        },
        "trizen-order"
      );
    }

    if (initializedRef.current && chatUnread > prevChatUnreadRef.current) {
      const latest = data.latestChat as {
        visitorName?: string;
        preview?: string | null;
      } | null;
      playChatSound();
      showChatNotification(
        "New chat message",
        latest?.visitorName
          ? `${latest.visitorName}: ${latest.preview || "New message"}`
          : "You have unread live chat messages",
        () => {
          window.location.href = "/admin/chat";
        },
        "trizen-chat"
      );
    }
    prevChatUnreadRef.current = chatUnread;

    if (data.serverTime) {
      sinceRef.current = data.serverTime;
    }
    initializedRef.current = true;
  }, []);

  useEffect(() => {
    void poll();
    const id = setInterval(() => void poll(), POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  async function enableNotifications() {
    const ok = await requestChatNotificationPermission();
    setPermission(ok ? "granted" : Notification.permission);
  }

  if (whatsappOk === false && !dismissedBanner) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm border border-green-600/40 bg-[var(--color-surface-elevated)] p-4 shadow-lg">
        <div className="flex gap-3">
          <MessageCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">অর্ডার + চ্যাট alert</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">
              WhatsApp bot reply দিচ্ছে না — Settings থেকে Telegram সেটআপ করুন
              (২ মিনিট, API key লাগে না)।
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/admin/settings"
                className="text-xs uppercase tracking-wider bg-green-600 text-white px-3 py-2"
              >
                Setup
              </Link>
              <button
                type="button"
                onClick={() => setDismissedBanner(true)}
                className="text-xs uppercase tracking-wider border border-[var(--color-border)] px-3 py-2"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    whatsappOk ||
    permission === "granted" ||
    permission === "unsupported" ||
    permission === "denied" ||
    dismissedBanner
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 shadow-lg">
      <p className="text-sm font-semibold">Browser alerts (optional)</p>
      <p className="text-xs text-[var(--color-muted)] mt-1">
        Admin খোলা থাকলে ব্রাউজার notification — WhatsApp এর জন্য Settings।
      </p>
      <button
        type="button"
        onClick={() => void enableNotifications()}
        className="mt-3 text-xs uppercase tracking-wider bg-black text-white px-3 py-2"
      >
        Enable browser
      </button>
    </div>
  );
}
