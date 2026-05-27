"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { TrizenLogo } from "@/components/TrizenLogo";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { AuthDivider } from "@/components/AuthDivider";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next");
  const redirectTo =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)]"
    >
      <TrizenLogo variant="on-light" width={48} height={48} className="mx-auto mb-4" />
      <h1 className="text-center text-lg font-bold uppercase tracking-wide mb-2">
        Create Account
      </h1>
      <p className="text-center text-sm text-[var(--color-muted)] mb-6">
        Register to shop faster and track orders
      </p>

      <GoogleSignInButton label="Sign up with Google" nextPath={redirectTo} />

      <AuthDivider />

      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
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
          autoComplete="new-password"
          minLength={8}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

      <Button type="submit" className="w-full mt-6" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-[var(--color-muted)] mt-6">
        Already have an account?{" "}
        <Link
          href={
            redirectTo !== "/"
              ? `/sign-in?next=${encodeURIComponent(redirectTo)}`
              : "/sign-in"
          }
          className="text-[var(--color-foreground)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-sm border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)] text-center text-sm text-[var(--color-muted)]">
            Loading...
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
