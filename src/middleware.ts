import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "trizen_admin_session";

function getJwtSecret() {
  const secret =
    process.env.ADMIN_JWT_SECRET?.trim() || process.env.JWT_SECRET?.trim() || "";
  return new TextEncoder().encode(secret);
}

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.JWT_SECRET?.trim()) return false;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === "admin" && typeof payload.sub === "string";
  } catch {
    return false;
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

  const isAdminPage =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi =
    pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/api/admin/login");

  if (isAdminPage || isAdminApi) {
    const ok = await hasValidAdminSession(request);
    if (!ok) {
      if (isAdminApi) {
        return applySecurityHeaders(
          NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        );
      }
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("from", pathname);
      return applySecurityHeaders(NextResponse.redirect(login));
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
