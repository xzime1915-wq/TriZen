import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import {
  isValidNewsletterEmail,
  upsertNewsletterSubscriber,
} from "@/lib/newsletter-subscribers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "");
    const firstName = String(body?.firstName ?? "").trim();

    if (!isValidNewsletterEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await upsertNewsletterSubscriber(email, firstName);

    try {
      const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
      const notifyTo = settings?.email?.trim() || "support@trizenstore.com.bd";
      const nameLine = firstName ? ` (${firstName})` : "";

      await sendEmail({
        to: notifyTo,
        subject: "New Sandbox signup, TRIZEN Store",
        text: `New Sandbox subscriber: ${email.trim().toLowerCase()}${nameLine}`,
        html: `<p>New Sandbox subscriber: <strong>${email.trim().toLowerCase()}</strong>${firstName ? `, ${firstName}` : ""}</p>`,
        replyTo: email.trim().toLowerCase(),
      });
    } catch (error) {
      console.error("[newsletter subscribe admin notify]", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter subscribe]", error);
    return NextResponse.json({ error: "Subscribe failed" }, { status: 500 });
  }
}
