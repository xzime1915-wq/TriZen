import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "trizen_admin_session";
type AdminRole = "owner" | "order_manager";

function getJwtSecret() {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.JWT_SECRET?.trim() || "";
  return secret ? new TextEncoder().encode(secret) : null;
}

function normalizeAdminRole(role: unknown): AdminRole {
  return role === "order_manager" ? "order_manager" : "owner";
}

function isOrderManagerPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname === "/admin/orders" ||
    pathname.startsWith("/admin/orders/") ||
    pathname === "/api/admin/logout" ||
    pathname === "/api/admin/orders" ||
    pathname.startsWith("/api/admin/orders/")
  );
}

async function readAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = getJwtSecret();
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return {
      id: payload.sub,
      role: normalizeAdminRole(payload.adminRole),
    };
  } catch {
    return null;
  }
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login");
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  /* Admin pages use requireAdmin() in each page — middleware here broke HTTP VPS logins */
  if (isAdminApi || isAdminPage) {
    const session = await readAdminSession(request);
    if (!session) {
      if (!isAdminApi) {
        return applySecurityHeaders(NextResponse.next());
      }

      return applySecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }

    if (session.role === "order_manager" && !isOrderManagerPath(pathname)) {
      if (isAdminApi) {
        return applySecurityHeaders(
          NextResponse.json({ error: "Forbidden" }, { status: 403 })
        );
      }

      const url = request.nextUrl.clone();
      url.pathname = "/admin/orders";
      url.search = "";
      return applySecurityHeaders(NextResponse.redirect(url));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
