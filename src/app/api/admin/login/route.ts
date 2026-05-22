import { NextResponse } from "next/server";
import {
  adminSessionCookieOptions,
  signAdminToken,
  verifyAdminLogin,
} from "@/lib/auth";

const ADMIN_COOKIE = "trizen_admin_session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`admin-login:${ip}`, 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const admin = await verifyAdminLogin(
    String(email).trim().toLowerCase(),
    String(password)
  );
  if (!admin) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken(admin.id);
  const response = NextResponse.json({ ok: true, name: admin.name });
  response.cookies.set(ADMIN_COOKIE, token, adminSessionCookieOptions());
  return response;
}
