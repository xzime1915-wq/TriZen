import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

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

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailInput) {
  const smtp = getSmtpConfig();
  const from =
    process.env.EMAIL_FROM?.trim() || "TriZen Store <support@trizenstore.com.bd>";
  const reply =
    replyTo?.trim() ||
    process.env.EMAIL_REPLY_TO?.trim() ||
    smtp?.auth.user ||
    from;

  if (smtp) {
    const transporter = nodemailer.createTransport(smtp);
    await transporter.sendMail({
      from,
      to: to.trim(),
      replyTo: reply,
      subject,
      html,
      text,
      headers: {
        "X-Priority": "3",
        Precedence: "normal",
      },
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS on the server."
    );
  }

  console.log("[dev-email]", { to, subject, text });
}
