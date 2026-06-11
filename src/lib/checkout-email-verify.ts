import { createHash, randomInt } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { useSecureCookies } from "@/lib/auth";

const COOKIE = "trizen_checkout_email_verified";
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SEC = 30 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function hashCode(code: string, email: string) {
  return createHash("sha256")
    .update(`${code}:${email}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

export function generateCheckoutEmailCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export async function sendCheckoutEmailCode(userId: string, email: string) {
  const normalized = email.trim().toLowerCase();
  const code = generateCheckoutEmailCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  await prisma.checkoutEmailCode.deleteMany({ where: { userId, email: normalized } });
  await prisma.checkoutEmailCode.create({
    data: {
      userId,
      email: normalized,
      codeHash: hashCode(code, normalized),
      expiresAt,
    },
  });

  const appUrl = process.env.APP_URL?.trim() || "https://trizenstore.com.bd";

  await sendEmail({
    to: normalized,
    subject: "Verify your email — TriZen Store",
    replyTo: "support@trizenstore.com.bd",
    text: [
      "TriZen Store — Verify your email",
      "",
      `Your verification code is: ${code}`,
      "",
      "Enter this code on the checkout page to continue your order.",
      "This code expires in 10 minutes.",
      "",
      `If you did not request this, you can ignore this email.`,
      "",
      `TriZen Store`,
      appUrl,
    ].join("\n"),
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:32px 16px">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px 28px">
                  <tr>
                    <td>
                      <p style="margin:0 0 8px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#71717a">TriZen Store</p>
                      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#18181b">Verify your email</h1>
                      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52525b">
                        Enter this code on the checkout page to continue your order.
                      </p>
                      <p style="margin:0 0 24px;font-size:34px;font-weight:700;letter-spacing:0.35em;color:#18181b">${code}</p>
                      <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#71717a">
                        This code expires in 10 minutes. If you did not request this email, you can safely ignore it.
                      </p>
                      <p style="margin:0;font-size:14px;line-height:1.6;color:#71717a">
                        <a href="${appUrl}/checkout" style="color:#18181b;font-weight:600;text-decoration:underline">Continue checkout</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  return {
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}

export async function confirmCheckoutEmailCode(
  userId: string,
  email: string,
  code: string
) {
  const normalized = email.trim().toLowerCase();
  const record = await prisma.checkoutEmailCode.findFirst({
    where: { userId, email: normalized },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return { error: "Code expired. Request a new one." };
  }

  if (record.codeHash !== hashCode(code.trim(), normalized)) {
    return { error: "Invalid code. Please try again." };
  }

  await prisma.checkoutEmailCode.deleteMany({ where: { userId, email: normalized } });
  await setCheckoutEmailVerifiedCookie(userId, normalized);
  return { ok: true as const };
}

export async function setCheckoutEmailVerifiedCookie(userId: string, email: string) {
  const token = await new SignJWT({
    sub: userId,
    email: email.trim().toLowerCase(),
    purpose: "checkout_email",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function isCheckoutEmailVerified(userId: string, email: string) {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return (
      payload.purpose === "checkout_email" &&
      payload.sub === userId &&
      payload.email === email.trim().toLowerCase()
    );
  } catch {
    return false;
  }
}

export async function requireCheckoutEmailVerified(userId: string, email: string) {
  const ok = await isCheckoutEmailVerified(userId, email);
  if (!ok) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }
}
