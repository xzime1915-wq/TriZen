import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const COOKIE = "trizen_admin_session";

export const ADMIN_ROLES = ["owner", "order_manager"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
};

export function normalizeAdminRole(role: string | null | undefined): AdminRole {
  return role === "order_manager" ? "order_manager" : "owner";
}

export function isOwnerAdmin(
  admin: Pick<AdminSession, "role"> | null | undefined
) {
  return admin?.role === "owner";
}

export function canManageOrders(admin: AdminSession | null | undefined) {
  return Boolean(admin);
}

function isExpiredAdmin(admin: { expiresAt: Date | null }) {
  return Boolean(admin.expiresAt && admin.expiresAt <= new Date());
}

export function useSecureCookies() {
  const appUrl =
    process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  return appUrl.startsWith("https://");
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: useSecureCookies(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function signAdminToken(adminId: string, adminRole: AdminRole = "owner") {
  return new SignJWT({ sub: adminId, role: "admin", adminRole })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
}

function getSecret() {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.JWT_SECRET?.trim();
  if (!secret) throw new Error("JWT_SECRET or ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createAdminSession(adminId: string) {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { role: true, expiresAt: true },
  });
  if (admin && isExpiredAdmin(admin)) {
    throw new Error("Admin account expired");
  }
  const token = await signAdminToken(adminId, normalizeAdminRole(admin?.role));
  const jar = await cookies();
  jar.set(COOKIE, token, adminSessionCookieOptions());
  return token;
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
      select: { id: true, email: true, name: true, role: true, expiresAt: true },
    });
    if (!admin) return null;
    if (isExpiredAdmin(admin)) return null;
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: normalizeAdminRole(admin.role),
    };
  } catch {
    return null;
  }
}

export async function verifyAdminLogin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!admin) return null;
  if (isExpiredAdmin(admin)) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? { ...admin, role: normalizeAdminRole(admin.role) } : null;
}

export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) return null;
  return admin;
}

export async function requireOwnerAdmin() {
  const admin = await getAdminSession();
  if (!isOwnerAdmin(admin)) return null;
  return admin;
}
