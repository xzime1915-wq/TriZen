"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { AuthDivider } from "@/components/AuthDivider";

const ERROR_MESSAGES: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again.",
  google_token:
    "Google sign-in failed (wrong client secret or redirect URI). Copy the newest secret from Google Console into VPS .env, then restart.",
  google_profile: "Google sign-in failed while reading your profile. Please try again.",
  google_db: "Google sign-in failed while saving your account. Check VPS database (pm2 logs).",
  google_state_invalid: "Google sign-in expired. Please try again.",
  google_not_configured:
    "Google sign-in is not set up. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env, then restart the server.",
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const urlError = searchParams.get("error");
  const displayError = error || (urlError ? ERROR_MESSAGES[urlError] || "Sign in failed" : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Sign in failed");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)]"
    >
      <Image src="/logo.png" alt="TriZen Store" width={48} height={48} className="mx-auto mb-4" />
      <h1 className="text-center text-lg font-bold uppercase tracking-wide mb-2">Sign In</h1>
      <p className="text-center text-sm text-[var(--color-muted)] mb-6">
        Welcome back to TriZen Store
      </p>

      <GoogleSignInButton label="Sign in with Google" />

      <AuthDivider />

      <div className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      {displayError && <p className="text-red-400 text-sm mt-3">{displayError}</p>}

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-[var(--color-muted)] mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-white hover:underline">
          Create account
        </Link>
      </p>
    </form>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-sm border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)] text-center text-sm text-[var(--color-muted)]">
            Loading...
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
