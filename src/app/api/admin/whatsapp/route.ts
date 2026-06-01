import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import {
  isAdminNotifyConfigured,
  notifyChannels,
  sendAdminTestAlert,
} from "@/lib/admin-notify";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const channels = notifyChannels();
  return NextResponse.json({
    configured: isAdminNotifyConfigured(),
    channels,
    telegram: Boolean(process.env.TELEGRAM_ADMIN_USER?.trim()),
    whatsapp: channels.some((c) => c.startsWith("WhatsApp")),
  });
}

export async function POST() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdminNotifyConfigured()) {
    return NextResponse.json(
      {
        error:
          "Not configured. Add TELEGRAM_ADMIN_USER to .env (easiest) or CallMeBot WhatsApp keys. Restart server.",
      },
      { status: 400 }
    );
  }

  await sendAdminTestAlert();
  return NextResponse.json({ ok: true, channels: notifyChannels() });
}
