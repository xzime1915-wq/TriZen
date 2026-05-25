import { NextRequest, NextResponse } from "next/server";
import { useSecureCookies } from "@/lib/auth";
import { getRequestOrigin } from "@/lib/env";
import {
  createGoogleOAuthState,
  getGoogleAuthUrl,
  safeRedirectPath,
} from "@/lib/user-auth";

const STATE_COOKIE = "google_oauth_state";
const NEXT_COOKIE = "google_oauth_next";

export async function GET(req: NextRequest) {
  const siteOrigin = getRequestOrigin(req);
  const nextPath = safeRedirectPath(req.nextUrl.searchParams.get("next"), "/");

  try {
    const state = createGoogleOAuthState();
    const url = getGoogleAuthUrl(siteOrigin, state);
    const res = NextResponse.redirect(url);
    res.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure: useSecureCookies(),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });
    if (nextPath !== "/") {
      res.cookies.set(NEXT_COOKIE, nextPath, {
        httpOnly: true,
        secure: useSecureCookies(),
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
      });
    }
    return res;
  } catch {
    return NextResponse.redirect(
      new URL("/sign-in?error=google_not_configured", siteOrigin)
    );
  }
}
