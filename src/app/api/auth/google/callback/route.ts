import { NextRequest, NextResponse } from "next/server";
import { findOrCreateGoogleUser } from "@/lib/user-auth";
import { getAppUrl } from "@/lib/env";

const STATE_COOKIE = "google_oauth_state";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const appUrl = getAppUrl(origin) || origin;
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

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
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

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return fail("/sign-in?error=google_failed");
    }

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await profileRes.json();
    if (!profileRes.ok || !profile.email) {
      return fail("/sign-in?error=google_failed");
    }

    await findOrCreateGoogleUser({
      sub: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });

    const res = NextResponse.redirect(new URL("/", appUrl));
    res.cookies.delete(STATE_COOKIE);
    return res;
  } catch {
    return fail("/sign-in?error=google_failed");
  }
}
