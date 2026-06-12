"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/Button";

export function WhatsAppAlertsCard() {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [channels, setChannels] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  const loadStatus = useCallback(async () => {
    const res = await fetch("/api/admin/whatsapp");
    if (!res.ok) return;
    const data = await res.json();
    setConfigured(data.configured);
    setChannels(data.channels ?? []);
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function sendTest() {
    setTesting(true);
    setMessage("");
    const res = await fetch("/api/admin/whatsapp", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setTesting(false);
    setMessage(
      res.ok
        ? `টেস্ট পাঠানো হয়েছে (${(data.channels as string[])?.join(", ") || "ok"}), Telegram/WhatsApp চেক করুন।`
        : data.error || "পাঠানো যায়নি। .env চেক করে server restart করুন।"
    );
  }

  return (
    <section className="mt-10 border border-[var(--color-border)] p-6 bg-[var(--color-surface-elevated)]">
      <div className="flex items-start gap-3">
        <MessageCircle className="h-6 w-6 shrink-0 text-green-600" />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest">
            Order &amp; chat alerts
          </h2>
          <p className="text-sm text-[var(--color-muted)] mt-2">
            নতুন <strong>অর্ডার</strong> ও <strong>লাইভ চ্যাট</strong> — ফোনে
            notification এর মতো মেসেজ।
          </p>

          {configured === null ? (
            <p className="text-xs mt-4 text-[var(--color-muted)]">Loading…</p>
          ) : configured ? (
            <p className="text-xs mt-4 text-green-700">
              সক্রিয়: {channels.join(" + ")}
            </p>
          ) : (
            <div className="mt-4 text-xs space-y-4 text-[var(--color-muted)]">
              <div>
                <p className="font-semibold text-[var(--color-foreground)] mb-2">
                  ✅ সহজ — Telegram (CallMeBot WhatsApp reply দিচ্ছে না)
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Telegram এ খুলুন:{" "}
                    <a
                      href="https://t.me/CallMeBot_txtbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-[var(--color-foreground)]"
                    >
                      @CallMeBot_txtbot
                    </a>
                  </li>
                  <li>
                    <code className="bg-zinc-100 px-1">/start</code> পাঠান (একবার)
                  </li>
                  <li>
                    `.env` এ আপনার username:{" "}
                    <code className="bg-zinc-100 px-1">
                      TELEGRAM_ADMIN_USER=&quot;@yourusername&quot;
                    </code>
                  </li>
                  <li>Server restart → নিচে Test</li>
                </ol>
                <p className="mt-2">
                  API key লাগে না — WhatsApp bot এর চেয়ে অনেক বেশি reliable।
                </p>
              </div>

              <div>
                <p className="font-semibold text-[var(--color-foreground)] mb-2">
                  WhatsApp (যখন bot উত্তর দেয়)
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Contact: <strong>+34 644 76 66 43</strong> (Spain +34)
                  </li>
                  <li>
                    মেসেজ:{" "}
                    <code className="bg-zinc-100 px-1">
                      I allow callmebot to send me messages
                    </code>
                  </li>
                  <li>
                    Key →{" "}
                    <code className="bg-zinc-100 px-1">CALLMEBOT_APIKEY</code>{" "}
                    (নম্বর ইতিমধ্যে .env এ)
                  </li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={testing || configured === false}
              onClick={() => void sendTest()}
            >
              {testing ? "Sending…" : "Send test alert"}
            </Button>
          </div>
          {message && (
            <p
              className={`text-xs mt-3 ${message.includes("যায়নি") ? "text-red-600" : "text-green-700"}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
