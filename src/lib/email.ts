import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

function senderDomain(from: string) {
  const match = from.match(/@([^>]+)>?$|@(\S+)$/);
  return match?.[1] || match?.[2] || "trizenstore.com.bd";
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT?.trim() || "465");
  const secure =
    process.env.SMTP_SECURE?.trim() === "true" ||
    (process.env.SMTP_SECURE?.trim() !== "false" && port === 465);

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  };
}

export async function sendEmail(input: SendEmailInput) {
  const smtp = getSmtpConfig();
  const from =
    process.env.EMAIL_FROM?.trim() || "TRIZEN Store <support@trizenstore.com.bd>";
  const reply =
    input.replyTo?.trim() ||
    process.env.EMAIL_REPLY_TO?.trim() ||
    smtp?.auth.user ||
    from;

  if (smtp) {
    const domain = senderDomain(from);
    const transporter = nodemailer.createTransport(smtp);
    await transporter.sendMail({
      from,
      to: input.to.trim(),
      replyTo: reply,
      subject: input.subject,
      text: input.text,
      ...(input.html ? { html: input.html } : {}),
      messageId: `<${randomUUID()}@${domain}>`,
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS on the server."
    );
  }

  console.log("[dev email]", {
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}
