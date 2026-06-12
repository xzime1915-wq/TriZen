"use client";

import { useLayoutEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { AuthDivider } from "@/components/AuthDivider";
import { AuthLoginVisual } from "@/components/auth/AuthLoginVisual";

const ERROR_MESSAGES: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again.",
  google_token:
    "Google sign-in failed (wrong client secret or redirect URI). Copy the newest secret from Google Console into VPS .env, then restart.",
  google_profile:
    "Google sign-in failed while reading your profile. Please try again.",
  google_db:
    "Google sign-in failed while saving your account. Check VPS database (pm2 logs).",
  google_state_invalid: "Google sign-in expired. Please try again.",
  google_not_configured:
    "Google sign-in is not set up. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env, then restart the server.",
};

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const showEmailLabel = !email && !emailFocused;
  const showPasswordLabel = !password && !passwordFocused;
  const showForgotPassword = !password && !passwordFocused;

  useLayoutEffect(() => {
    function syncAutofill() {
      const emailValue = emailRef.current?.value ?? "";
      const passwordValue = passwordRef.current?.value ?? "";
      if (emailValue) setEmail(emailValue);
      if (passwordValue) setPassword(passwordValue);
    }

    syncAutofill();
    const timers = [0, 50, 150, 350, 800, 1500, 2500].map((ms) =>
      setTimeout(syncAutofill, ms)
    );
    const interval = setInterval(syncAutofill, 400);
    const stopInterval = setTimeout(() => clearInterval(interval), 4000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
      clearTimeout(stopInterval);
    };
  }, []);

  function syncFieldFromDom(field: "email" | "password") {
    if (field === "email") {
      const value = emailRef.current?.value ?? "";
      if (value) setEmail(value);
      return;
    }
    const value = passwordRef.current?.value ?? "";
    if (value) setPassword(value);
  }

  function handleAutofillAnimation(
    field: "email" | "password",
    e: React.AnimationEvent<HTMLInputElement>
  ) {
    if (e.animationName === "auth-wallhack-autofill-start") {
      syncFieldFromDom(field);
    }
  }

  const urlError = searchParams.get("error");
  const nextPath = searchParams.get("next");
  const redirectTo =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/";
  const registerHref =
    redirectTo !== "/"
      ? `/register?next=${encodeURIComponent(redirectTo)}`
      : "/register";
  const displayError =
    error || (urlError ? ERROR_MESSAGES[urlError] || "Sign in failed" : "");
  const resetSuccess = searchParams.get("reset") === "1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current?.value || email,
        password: passwordRef.current?.value || password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Sign in failed");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="auth-wallhack-form">
      <p className="auth-wallhack-intro">
        Sign in to your TRIZEN account to track orders, manage your profile, and
        check out faster next time.
      </p>

      <div className="auth-wallhack-fields">
        <label
          className={`auth-wallhack-infield${email || emailFocused ? " auth-wallhack-infield--filled" : ""}`}
        >
          {showEmailLabel ? (
            <span className="auth-wallhack-infield-label">E-mail</span>
          ) : null}
          <input
            ref={emailRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onInput={(e) => setEmail(e.currentTarget.value)}
            onFocus={() => {
              setEmailFocused(true);
              syncFieldFromDom("email");
            }}
            onBlur={() => {
              syncFieldFromDom("email");
              setEmailFocused(false);
            }}
            onAnimationStart={(e) => handleAutofillAnimation("email", e)}
            required
            autoComplete="email"
            className="auth-wallhack-infield-input"
          />
        </label>

        <div
          className={`auth-wallhack-infield${password || passwordFocused ? " auth-wallhack-infield--filled" : ""}`}
        >
          {showPasswordLabel ? (
            <span className="auth-wallhack-infield-label">Password</span>
          ) : null}
          <input
            ref={passwordRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onInput={(e) => setPassword(e.currentTarget.value)}
            onFocus={() => {
              setPasswordFocused(true);
              syncFieldFromDom("password");
            }}
            onBlur={() => {
              syncFieldFromDom("password");
              setPasswordFocused(false);
            }}
            onAnimationStart={(e) => handleAutofillAnimation("password", e)}
            required
            autoComplete="current-password"
            className={`auth-wallhack-infield-input${showForgotPassword ? " auth-wallhack-infield-input--with-forgot" : ""}`}
          />
          {showForgotPassword ? (
            <Link href="/forgot-password" className="auth-wallhack-forgot">
              Forgot password?
            </Link>
          ) : null}
        </div>
      </div>

      {resetSuccess ? (
        <p className="auth-wallhack-success">
          Password updated. Sign in with your new password.
        </p>
      ) : null}

      {displayError ? (
        <p className="auth-wallhack-error">{displayError}</p>
      ) : null}

      <Button type="submit" className="auth-wallhack-submit w-full" size="lg" disabled={loading}>
        {loading ? "Signing in..." : "Login"}
      </Button>

      <Link href={registerHref} className="block">
        <Button type="button" variant="secondary" className="auth-wallhack-secondary w-full" size="lg">
          Create account
        </Button>
      </Link>

      <AuthDivider />

      <GoogleSignInButton label="Continue with Google" nextPath={redirectTo} />
    </form>
  );
}

function SignInFallback() {
  return (
    <div className="auth-wallhack-form">
      <p className="auth-wallhack-intro">Loading...</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="auth-wallhack-page">
      <div className="auth-wallhack-visual" aria-hidden>
        <AuthLoginVisual />
      </div>

      <div className="auth-wallhack-panel">
        <div className="auth-wallhack-visual-mobile lg:hidden" aria-hidden>
          <AuthLoginVisual wordCount={22} />
        </div>

        <Suspense fallback={<SignInFallback />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
