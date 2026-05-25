import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGoogleUser, safeRedirectPath } from "@/lib/user-auth";
import { getRequestOrigin } from "@/lib/env";

const STATE_COOKIE = "google_oauth_state";
const NEXT_COOKIE = "google_oauth_next";

export async function GET(req: NextRequest) {
  const appUrl = getRequestOrigin(req);
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const state = req.nextUrl.searchParams.get("state");
  const savedState = req.cookies.get(STATE_COOKIE)?.value;

  const fail = (path: string) => {
    const res = NextResponse.redirect(new URL(path, appUrl));
    res.cookies.delete(STATE_COOKIE);
    return res;
  };

  if (error || !code) {
    return fail("/sign-in?error=google_cancelled");
  }

  if (!state || !savedState || state !== savedState) {
    return fail("/sign-in?error=google_state_invalid");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return fail("/sign-in?error=google_not_configured");
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("[google oauth] token exchange failed", {
        redirectUri,
        error: tokenData.error,
        description: tokenData.error_description,
      });
      return fail("/sign-in?error=google_token");
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = (await profileRes.json()) as {
      sub?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    if (!profileRes.ok || !profile.email || !profile.sub) {
      console.error("[google oauth] profile fetch failed", profile);
      return fail("/sign-in?error=google_profile");
    }

    await findOrCreateGoogleUser({
      sub: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });

    const nextPath = safeRedirectPath(req.cookies.get(NEXT_COOKIE)?.value, "/");
    const res = NextResponse.redirect(new URL(nextPath, appUrl));
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(NEXT_COOKIE);
    return res;
  } catch (err) {
    console.error("[google oauth] callback error", err);
    return fail("/sign-in?error=google_db");
  }
}
