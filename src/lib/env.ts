const WEAK_SECRETS = new Set([
  "change-this-to-a-long-random-secret-in-production",
  "dev-secret",
  "secret",
]);

function isLocalDevUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Canonical site URL for Google OAuth (always non-www in production). */
export function getOAuthOrigin(fallbackOrigin?: string): string {
  if (process.env.NODE_ENV === "production") {
    const fromEnv = getAppUrl();
    if (fromEnv && !isLocalDevUrl(fromEnv)) {
      return normalizeProductionOrigin(fromEnv);
    }
    return "https://trizenstore.com.bd";
  }
  const origin = (fallbackOrigin || getAppUrl() || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  return isLocalDevUrl(origin) ? "http://localhost:3000" : origin;
}

/** One canonical host for OAuth — www vs non-www mismatch causes invalid_grant. */
function normalizeProductionOrigin(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (u.hostname === "www.trizenstore.com.bd") {
      u.hostname = "trizenstore.com.bd";
    }
    return u.origin;
  } catch {
    return url.replace(/\/$/, "");
  }
}

/** Live site URL from proxy headers — avoids localhost from misconfigured APP_URL on VPS. */
export function getRequestOrigin(req: {
  headers: { get(name: string): string | null };
  nextUrl: { origin: string };
}): string {
  return getOAuthOrigin(req.nextUrl.origin);
}

export function getAppUrl(fallbackOrigin?: string): string {
  const envUrl = (
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    ""
  ).replace(/\/$/, "");
  const fallback = (fallbackOrigin?.trim() || "").replace(/\/$/, "");

  // VPS .env sometimes still has localhost — prefer the real request host in production.
  if (process.env.NODE_ENV === "production") {
    if (envUrl && !isLocalDevUrl(envUrl)) return envUrl;
    if (fallback && !isLocalDevUrl(fallback)) return fallback;
  }

  return envUrl || fallback;
}

export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") return;

  const jwt = process.env.JWT_SECRET?.trim();
  if (!jwt || jwt.length < 32 || WEAK_SECRETS.has(jwt)) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 32 characters in production."
    );
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required in production.");
  }
  if (
    process.env.NETLIFY === "true" &&
    (databaseUrl.startsWith("file:") || databaseUrl.includes("sqlite"))
  ) {
    throw new Error(
      "Netlify does not support SQLite. Use a PostgreSQL URL from Neon — see NETLIFY-SETUP.md."
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (adminPassword && (adminPassword.length < 12 || adminPassword === "TriZen@2026")) {
    throw new Error("ADMIN_PASSWORD must be a strong unique password in production.");
  }
}
