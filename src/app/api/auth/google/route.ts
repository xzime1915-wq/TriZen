import { NextRequest, NextResponse } from "next/server";
import { useSecureCookies } from "@/lib/auth";
import { getRequestOrigin } from "@/lib/env";
import { createGoogleOAuthState, getGoogleAuthUrl } from "@/lib/user-auth";

const STATE_COOKIE = "google_oauth_state";

export async function GET(req: NextRequest) {
  const siteOrigin = getRequestOrigin(req);

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
    return res;
  } catch {
    return NextResponse.redirect(
      new URL("/sign-in?error=google_not_configured", siteOrigin)
    );
  }
}
