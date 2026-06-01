/**
 * Admin alerts: new order + live chat
 * — WhatsApp (CallMeBot / Meta) if configured
 * — Telegram (@CallMeBot_txtbot) — no API key, usually works when WhatsApp bot is silent
 */

const STORE_LABEL = "TriZen Store";

function appBaseUrl() {
  return (
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    ""
  );
}

function formatAlert(lines: string[]) {
  return [`🔔 ${STORE_LABEL}`, "", ...lines].join("\n");
}

export function isAdminNotifyConfigured(): boolean {
  return Boolean(whatsAppProvider() || telegramAdminUser());
}

export function whatsAppProvider(): "callmebot" | "meta" | null {
  if (
    process.env.WHATSAPP_ACCESS_TOKEN?.trim() &&
    process.env.WHATSAPP_PHONE_NUMBER_ID?.trim() &&
    process.env.WHATSAPP_ADMIN_PHONE?.trim()
  ) {
    return "meta";
  }
  if (
    process.env.CALLMEBOT_APIKEY?.trim() &&
    process.env.CALLMEBOT_PHONE?.trim()
  ) {
    return "callmebot";
  }
  return null;
}

function telegramAdminUser(): string | null {
  const u = process.env.TELEGRAM_ADMIN_USER?.trim();
  if (!u) return null;
  if (u.startsWith("@")) return u;
  const digits = u.replace(/\D/g, "");
  if (u.startsWith("+") || digits.length >= 10) {
    if (u.startsWith("+")) return u;
    if (digits.startsWith("880")) return `+${digits}`;
    return `+880${digits.replace(/^0/, "")}`;
  }
  return `@${u}`;
}

export function notifyChannels(): string[] {
  const ch: string[] = [];
  const wp = whatsAppProvider();
  if (wp) ch.push(wp === "meta" ? "WhatsApp (Meta)" : "WhatsApp (CallMeBot)");
  if (telegramAdminUser()) ch.push("Telegram");
  return ch;
}

async function dispatchAlert(text: string) {
  await Promise.all([sendWhatsApp(text), sendTelegram(text)]);
}

async function sendWhatsApp(text: string) {
  const provider = whatsAppProvider();
  if (!provider) return;

  if (provider === "meta") {
    const ok = await sendViaMetaCloud(text);
    if (ok === "ok") return;
  }
  await sendViaCallMeBot(text);
}

async function sendViaMetaCloud(text: string): Promise<"ok" | "skip" | "fail"> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const to = process.env.WHATSAPP_ADMIN_PHONE?.trim()?.replace(/\D/g, "");
  if (!token || !phoneNumberId || !to) return "skip";

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text.slice(0, 4096) },
        }),
      }
    );
    if (!res.ok) {
      console.error("[notify/whatsapp/meta]", await res.text());
      return "fail";
    }
    return "ok";
  } catch (e) {
    console.error("[notify/whatsapp/meta]", e);
    return "fail";
  }
}

async function sendViaCallMeBot(text: string) {
  const apikey = process.env.CALLMEBOT_APIKEY?.trim();
  let phone = process.env.CALLMEBOT_PHONE?.trim();
  if (!apikey || !phone) return;

  if (!phone.startsWith("+")) {
    phone = phone.startsWith("880")
      ? `+${phone}`
      : `+880${phone.replace(/^0/, "")}`;
  }

  try {
    const url = new URL("https://api.callmebot.com/whatsapp.php");
    url.searchParams.set("phone", phone);
    url.searchParams.set("text", text.slice(0, 1400));
    url.searchParams.set("apikey", apikey);

    const res = await fetch(url.toString());
    const body = await res.text();
    if (!res.ok || body.toLowerCase().includes("error")) {
      console.error("[notify/whatsapp/callmebot]", body);
    }
  } catch (e) {
    console.error("[notify/whatsapp/callmebot]", e);
  }
}

/** CallMeBot Telegram — authorize once: /start to @CallMeBot_txtbot */
async function sendTelegram(text: string) {
  const user = telegramAdminUser();
  if (!user) return;

  try {
    const url = new URL("https://api.callmebot.com/text.php");
    url.searchParams.set("user", user);
    url.searchParams.set("text", text.slice(0, 1400));

    const res = await fetch(url.toString());
    const body = await res.text();
    if (!res.ok || /error|not authorized|spam/i.test(body)) {
      console.error("[notify/telegram]", body);
    }
  } catch (e) {
    console.error("[notify/telegram]", e);
  }
}

export function notifyAdminNewOrder(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  id: string;
}) {
  const base = appBaseUrl();
  const link = base ? `${base}/admin/orders/${order.id}` : "";
  const text = formatAlert([
    "🛒 নতুন অর্ডার / New order",
    `অর্ডার: ${order.orderNumber}`,
    `নাম: ${order.customerName}`,
    `ফোন: ${order.customerPhone}`,
    `মোট: ৳${order.total}`,
    `পেমেন্ট: ${order.paymentMethod}`,
    ...(link ? [`লিংক: ${link}`] : []),
  ]);
  void dispatchAlert(text);
}

export function notifyAdminChatMessage(input: {
  visitorName: string;
  preview: string;
}) {
  const base = appBaseUrl();
  const link = base ? `${base}/admin/chat` : "";
  const text = formatAlert([
    "💬 লাইভ চ্যাট / Live chat",
    `গ্রাহক: ${input.visitorName}`,
    `মেসেজ: ${input.preview}`,
    ...(link ? [`লিংক: ${link}`] : []),
  ]);
  void dispatchAlert(text);
}

export async function sendAdminTestAlert() {
  const text = formatAlert([
    "✅ টেস্ট সফল / Test OK",
    "অর্ডার + লাইভ চ্যাট এখানে notification আসবে।",
  ]);
  await dispatchAlert(text);
}

// Back-compat exports
export const isWhatsAppAdminConfigured = isAdminNotifyConfigured;
export const notifyWhatsAppNewOrder = notifyAdminNewOrder;
export const notifyWhatsAppChatMessage = notifyAdminChatMessage;
export const sendWhatsAppTestAlert = sendAdminTestAlert;
