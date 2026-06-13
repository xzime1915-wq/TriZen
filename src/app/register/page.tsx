"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { AuthDivider } from "@/components/AuthDivider";
import { AuthLoginVisual } from "@/components/auth/AuthLoginVisual";

function AuthInfield({
  label,
  type = "text",
  value,
  onChange,
  required,
  autoComplete,
  minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  const showLabel = !value && !focused;

  return (
    <label
      className={`auth-wallhack-infield${value || focused ? " auth-wallhack-infield--filled" : ""}`}
    >
      {showLabel ? <span className="auth-wallhack-infield-label">{label}</span> : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        className="auth-wallhack-infield-input"
      />
    </label>
  );
}

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
  const signInHref =
    redirectTo !== "/"
      ? `/sign-in?next=${encodeURIComponent(redirectTo)}`
      : "/sign-in";

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
    <form onSubmit={handleSubmit} className="auth-wallhack-form">
      <p className="auth-wallhack-intro">
        Create your TRIZEN account to shop faster, track orders, and manage your
        profile in one place.
      </p>

      <div className="auth-wallhack-fields">
        <AuthInfield
          label="Full name"
          value={name}
          onChange={setName}
          required
          autoComplete="name"
        />
        <AuthInfield
          label="E-mail"
          type="email"
          value={email}
          onChange={setEmail}
          required
          autoComplete="email"
        />
        <AuthInfield
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          autoComplete="new-password"
          minLength={8}
        />
        <AuthInfield
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      {error ? <p className="auth-wallhack-error">{error}</p> : null}

      <Button type="submit" className="auth-wallhack-submit w-full" size="lg" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <Link href={signInHref} className="block">
        <Button type="button" variant="secondary" className="auth-wallhack-secondary w-full" size="lg">
          Sign in
        </Button>
      </Link>

      <AuthDivider />

      <GoogleSignInButton label="Continue with Google" nextPath={redirectTo} />
    </form>
  );
}

function RegisterFallback() {
  return (
    <div className="auth-wallhack-form">
      <p className="auth-wallhack-intro">Loading...</p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="auth-wallhack-page">
      <div className="auth-wallhack-visual" aria-hidden>
        <AuthLoginVisual word="Register" />
      </div>

      <div className="auth-wallhack-panel">
        <div className="auth-wallhack-visual-mobile lg:hidden" aria-hidden>
          <AuthLoginVisual word="Register" wordCount={22} />
        </div>

        <Suspense fallback={<RegisterFallback />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
