import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

function parseFromAddress(from: string) {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "TriZen Store", email: from.trim() };
}

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

async function sendViaBrevo(
  input: SendEmailInput,
  from: string,
  reply: string
) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) return false;

  const sender = parseFromAddress(from);
  const replyAddress = parseFromAddress(reply).email || reply;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: input.to.trim() }],
      replyTo: { email: replyAddress, name: sender.name },
      subject: input.subject,
      textContent: input.text,
      ...(input.html ? { htmlContent: input.html } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || "Brevo failed to send email");
  }

  return true;
}

async function sendViaSmtp(
  input: SendEmailInput,
  from: string,
  reply: string
) {
  const smtp = getSmtpConfig();
  if (!smtp) return false;

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

  return true;
}

export async function sendEmail(input: SendEmailInput) {
  const from =
    process.env.EMAIL_FROM?.trim() || "TriZen Store <support@trizenstore.com.bd>";
  const smtp = getSmtpConfig();
  const reply =
    input.replyTo?.trim() ||
    process.env.EMAIL_REPLY_TO?.trim() ||
    smtp?.auth.user ||
    from;

  if (await sendViaBrevo(input, from, reply)) return;
  if (await sendViaSmtp(input, from, reply)) return;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Email is not configured. Set BREVO_API_KEY or SMTP credentials on the server."
    );
  }

  console.log("[dev-email]", {
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}
