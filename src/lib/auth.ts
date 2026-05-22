import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "trizen_admin_session";

function useSecureCookies() {
  const appUrl =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  return appUrl.startsWith("https://");
}

function getSecret() {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (!secret) throw new Error("JWT_SECRET or ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(adminId: string) {
  const token = await new SignJWT({ sub: adminId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin") return null;

    const admin = await prisma.admin.findUnique({
      where: { id: payload.sub as string },
      select: { id: true, email: true, name: true },
    });
    return admin;
  } catch {
    return null;
  }
}

export async function verifyAdminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? admin : null;
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) return null;
  return admin;
}
