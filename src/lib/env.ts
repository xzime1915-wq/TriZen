const WEAK_SECRETS = new Set([
  "change-this-to-a-long-random-secret-in-production",
  "dev-secret",
  "secret",
]);

function isLocalDevUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
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
