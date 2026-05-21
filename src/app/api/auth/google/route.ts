import { NextRequest, NextResponse } from "next/server";
import { createGoogleOAuthState, getGoogleAuthUrl } from "@/lib/user-auth";

const STATE_COOKIE = "google_oauth_state";

export async function GET(req: NextRequest) {
  try {
    const state = createGoogleOAuthState();
    const url = getGoogleAuthUrl(req.nextUrl.origin, state);
    const res = NextResponse.redirect(url);
    res.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    });
    return res;
  } catch {
    return NextResponse.redirect(
      new URL("/sign-in?error=google_not_configured", req.nextUrl.origin)
    );
  }
}
