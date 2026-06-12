import { createHash, randomInt } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { useSecureCookies } from "@/lib/auth";
import {
  buildTrizenVerificationEmailHtml,
  buildTrizenVerificationEmailText,
} from "@/lib/trizen-email-template";

const COOKIE = "trizen_checkout_email_verified";
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SEC = 30 * 60;

export function normalizeCheckoutEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isCheckoutEmailAddress(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeCheckoutEmail(email));
}

export function guestCheckoutUserId(email: string) {
  return `guest:${normalizeCheckoutEmail(email)}`;
}

export function checkoutVerifyUserId(userId: string | null | undefined, email: string) {
  return userId ?? guestCheckoutUserId(email);
}

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

function buildCheckoutVerifyEmailHtml(email: string, code: string) {
  return buildTrizenVerificationEmailHtml({
    eyebrow: "Checkout verification",
    intro: "Continue checkout with the code below.",
    email,
    codeLabel: "Your verification code",
    code,
  });
}

function buildCheckoutVerifyEmailText(email: string, code: string) {
  return buildTrizenVerificationEmailText({
    eyebrow: "Checkout verification",
    intro: "Continue checkout with the code below.",
    email,
    codeLabel: "Your verification code",
    code,
  });
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

  await sendEmail({
    to: normalized,
    subject: "Your TRIZEN checkout code",
    replyTo: "support@trizenstore.com.bd",
    text: buildCheckoutVerifyEmailText(normalized, code),
    html: buildCheckoutVerifyEmailHtml(normalized, code),
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

export async function clearCheckoutEmailVerifiedCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
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
