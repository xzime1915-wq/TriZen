import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const firstName = String(body?.firstName ?? "").trim();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
    const notifyTo = settings?.email?.trim() || "support@trizenstore.com.bd";
    const nameLine = firstName ? ` (${firstName})` : "";

    await sendEmail({
      to: notifyTo,
      subject: "New newsletter signup — TRIZEN Store",
      text: `New newsletter subscriber: ${email}${nameLine}`,
      html: `<p>New newsletter subscriber: <strong>${email}</strong>${firstName ? ` — ${firstName}` : ""}</p>`,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
