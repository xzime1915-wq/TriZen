"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

type Step = "email" | "code" | "password";

function DigitInput({
  index,
  digit,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
}: {
  index: number;
  digit: string;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete={index === 0 ? "one-time-code" : "off"}
      maxLength={1}
      value={digit}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      onPaste={onPaste}
      className={`checkout-email-verify-digit${digit ? " checkout-email-verify-digit--filled" : ""}`}
      aria-label={`Digit ${index + 1}`}
    />
  );
}

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const submittedRef = useRef("");

  const showEmailLabel = !email && !emailFocused;

  async function sendCode() {
    setSending(true);
    setError("");
    submittedRef.current = "";
    setDigits(["", "", "", "", "", ""]);
    try {
      const res = await fetch("/api/auth/forgot-password/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      if (data.devCode) setDevCode(String(data.devCode));
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setSending(false);
    }
  }

  async function confirmCode(code: string) {
    if (verifying || submittedRef.current === code) return;
    submittedRef.current = code;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setStep("password");
    } catch (err) {
      submittedRef.current = "";
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reset password");
      router.push("/sign-in?reset=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (step === "code") inputsRef.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    const code = digits.join("");
    if (step === "code" && code.length === 6) void confirmCode(code);
  }, [digits, step]);

  function updateDigit(index: number, value: string) {
    const next = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
    if (next && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  if (step === "email") {
    return (
      <div className="auth-wallhack-form">
        <p className="auth-wallhack-intro">
          Enter your account email and we will send a 6-digit code to reset your
          password.
        </p>

        <label
          className={`auth-wallhack-infield${email || emailFocused ? " auth-wallhack-infield--filled" : ""}`}
        >
          {showEmailLabel ? (
            <span className="auth-wallhack-infield-label">E-mail</span>
          ) : null}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            required
            autoComplete="email"
            className="auth-wallhack-infield-input"
          />
        </label>

        {error ? <p className="auth-wallhack-error">{error}</p> : null}

        <Button
          type="button"
          className="auth-wallhack-submit w-full"
          size="lg"
          disabled={sending || !email.trim()}
          onClick={() => void sendCode()}
        >
          {sending ? "Sending..." : "Send code"}
        </Button>

        <Link href="/sign-in" className="auth-forgot-back mt-4 block text-center">
          Back to login
        </Link>
      </div>
    );
  }

  if (step === "code") {
    return (
      <div className="auth-wallhack-form">
        <h1 className="checkout-email-verify-title">Verify your email</h1>
        <p className="checkout-email-verify-subtitle">
          Code sent to <strong>{email}</strong>
        </p>

        <div className="checkout-email-verify-form">
          <div className="checkout-email-verify-digits">
            <div className="checkout-email-verify-group">
              {digits.slice(0, 3).map((digit, index) => (
                <DigitInput
                  key={index}
                  index={index}
                  digit={digit}
                  inputRef={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  onChange={updateDigit}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <span className="checkout-email-verify-sep" aria-hidden />
            <div className="checkout-email-verify-group">
              {digits.slice(3, 6).map((digit, offset) => {
                const index = offset + 3;
                return (
                  <DigitInput
                    key={index}
                    index={index}
                    digit={digit}
                    inputRef={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    onChange={updateDigit}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                  />
                );
              })}
            </div>
          </div>

          {verifying ? (
            <p className="checkout-email-verify-status">Verifying...</p>
          ) : null}
          {error ? <p className="checkout-email-verify-error">{error}</p> : null}
          {devCode ? (
            <p className="checkout-email-verify-dev">Dev code: {devCode}</p>
          ) : null}
        </div>

        <div className="checkout-email-verify-links">
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setError("");
              setDevCode(null);
            }}
            className="checkout-email-verify-link-primary"
          >
            Change email
          </button>
          <div className="checkout-email-verify-link-row">
            <button
              type="button"
              onClick={() => void sendCode()}
              disabled={sending}
              className="checkout-email-verify-link-secondary"
            >
              {sending ? "Sending..." : "Resend"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="auth-wallhack-form">
      <p className="auth-wallhack-intro">
        Choose a new password for <strong>{email}</strong>.
      </p>

      <div className="auth-wallhack-fields">
        <label
          className={`auth-wallhack-infield${password || passwordFocused ? " auth-wallhack-infield--filled" : ""}`}
        >
          {!password && !passwordFocused ? (
            <span className="auth-wallhack-infield-label">New password</span>
          ) : null}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
            minLength={8}
            autoComplete="new-password"
            className="auth-wallhack-infield-input"
          />
        </label>

        <label
          className={`auth-wallhack-infield${confirmPassword || confirmFocused ? " auth-wallhack-infield--filled" : ""}`}
        >
          {!confirmPassword && !confirmFocused ? (
            <span className="auth-wallhack-infield-label">Confirm password</span>
          ) : null}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
            required
            minLength={8}
            autoComplete="new-password"
            className="auth-wallhack-infield-input"
          />
        </label>
      </div>

      {error ? <p className="auth-wallhack-error">{error}</p> : null}

      <Button
        type="submit"
        className="auth-wallhack-submit w-full"
        size="lg"
        disabled={submitting}
      >
        {submitting ? "Saving..." : "Reset password"}
      </Button>
    </form>
  );
}
