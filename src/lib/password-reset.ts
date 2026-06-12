import { createHash, randomInt } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import {
  isCheckoutEmailAddress,
  normalizeCheckoutEmail,
} from "@/lib/checkout-email-verify";
import { useSecureCookies } from "@/lib/auth";

const COOKIE = "trizen_password_reset_verified";
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SEC = 20 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function hashCode(code: string, email: string) {
  return createHash("sha256")
    .update(`password-reset:${code}:${email}:${process.env.JWT_SECRET}`)
    .digest("hex");
}

function generateResetCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

function buildResetEmailHtml(email: string, code: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:48px 20px;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:420px;margin:0 auto">
      <tr>
        <td align="center" style="padding-bottom:28px">
          <span style="font-size:24px;font-weight:700;letter-spacing:-0.03em;color:#18181b">TRIZEN</span>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e4e4e7;padding-top:32px">
          <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#71717a;text-align:center">
            Reset password for
          </p>
          <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#18181b;text-align:center;font-weight:500">
            ${email}
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#71717a;text-align:center">
            Enter this code to reset your password:
          </p>
          <p style="margin:0 0 32px;font-size:40px;line-height:1;font-weight:700;letter-spacing:0.14em;color:#18181b;text-align:center;font-variant-numeric:tabular-nums">
            ${code}
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#a1a1aa;text-align:center">
            Expires in 10 minutes
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildResetEmailText(email: string, code: string) {
  return [
    "TRIZEN",
    "",
    `Reset password for ${email}`,
    "",
    "Enter this code to reset your password:",
    "",
    code,
    "",
    "Expires in 10 minutes.",
  ].join("\n");
}

export async function sendPasswordResetCode(email: string) {
  const normalized = normalizeCheckoutEmail(email);
  if (!isCheckoutEmailAddress(normalized)) {
    throw new Error("Enter a valid email address.");
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) {
    return { sent: true as const, devCode: undefined };
  }

  const code = generateResetCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);

  await prisma.passwordResetCode.deleteMany({ where: { email: normalized } });
  await prisma.passwordResetCode.create({
    data: {
      email: normalized,
      codeHash: hashCode(code, normalized),
      expiresAt,
    },
  });

  await sendEmail({
    to: normalized,
    subject: "Your TRIZEN password reset code",
    replyTo: "support@trizenstore.com.bd",
    text: buildResetEmailText(normalized, code),
    html: buildResetEmailHtml(normalized, code),
  });

  return {
    sent: true as const,
    devCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}

export async function confirmPasswordResetCode(email: string, code: string) {
  const normalized = normalizeCheckoutEmail(email);
  const record = await prisma.passwordResetCode.findFirst({
    where: { email: normalized },
    orderBy: { createdAt: "desc" },
  });

  if (!record || record.expiresAt < new Date()) {
    return { error: "Code expired. Request a new one." };
  }

  if (record.codeHash !== hashCode(code.trim(), normalized)) {
    return { error: "Invalid code. Please try again." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) {
    return { error: "This account cannot reset password here." };
  }

  await prisma.passwordResetCode.deleteMany({ where: { email: normalized } });
  await setPasswordResetVerifiedCookie(normalized);
  return { ok: true as const };
}

async function setPasswordResetVerifiedCookie(email: string) {
  const token = await new SignJWT({
    email: normalizeCheckoutEmail(email),
    purpose: "password_reset",
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

export async function clearPasswordResetVerifiedCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

async function getVerifiedResetEmail() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.purpose !== "password_reset") return null;
    return String(payload.email ?? "");
  } catch {
    return null;
  }
}

export async function resetPasswordWithVerifiedSession(
  email: string,
  password: string
) {
  const normalized = normalizeCheckoutEmail(email);
  const verifiedEmail = await getVerifiedResetEmail();
  if (!verifiedEmail || verifiedEmail !== normalized) {
    return { error: "Verification expired. Request a new code." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user?.passwordHash) {
    return { error: "This account cannot reset password here." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await clearPasswordResetVerifiedCookie();
  return { ok: true as const };
}
