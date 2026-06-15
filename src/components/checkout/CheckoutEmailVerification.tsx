"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { CheckoutFooterLinks } from "@/components/checkout/CheckoutFooterLinks";

type Props = {
  email: string;
  onVerified: () => void;
  onEmailChange?: (email: string) => void;
  signedIn?: boolean;
};

type Step = "confirm" | "code";

async function readJsonResponse(res: Response) {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("Server error. Please try again.");
  }
}

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

export function CheckoutVerifyFooter() {
  return <CheckoutFooterLinks className="checkout-email-verify-footer" />;
}

export function CheckoutEmailVerification({
  email,
  onVerified,
  onEmailChange,
  signedIn = false,
}: Props) {
  const [step, setStep] = useState<Step>("confirm");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const submittedRef = useRef("");

  async function sendCode(): Promise<boolean> {
    setSending(true);
    setError("");
    submittedRef.current = "";
    setDigits(["", "", "", "", "", ""]);
    try {
      const res = await fetch("/api/checkout/verify-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) throw new Error(String(data.error || "Failed to send code"));
      if (data.devCode) setDevCode(String(data.devCode));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
      return false;
    } finally {
      setSending(false);
    }
  }

  async function handleContinue() {
    const sent = await sendCode();
    if (sent) setStep("code");
  }

  async function confirmCode(code: string) {
    if (verifying || submittedRef.current === code) return;
    submittedRef.current = code;
    setVerifying(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/verify-email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email: email.trim() }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) throw new Error(String(data.error || "Verification failed"));
      onVerified();
    } catch (err) {
      submittedRef.current = "";
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
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

  if (step === "confirm") {
    return (
      <div className="checkout-email-verify checkout-email-verify--confirm">
        <div className="checkout-email-confirm">
          {signedIn ? (
            <>
              <div className="checkout-email-confirm-avatar" aria-hidden>
                {email.charAt(0).toUpperCase() || "?"}
              </div>
              <p className="checkout-email-confirm-email">{email}</p>
            </>
          ) : (
            <label className="checkout-email-guest-field">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => onEmailChange?.(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                className="checkout-email-guest-input"
              />
            </label>
          )}

          {error ? (
            <p className="checkout-email-verify-error checkout-email-confirm-error">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={handleContinue}
            disabled={sending || !email}
            className="checkout-email-continue-btn"
          >
            {sending ? "Sending…" : "Continue"}
          </button>

          {signedIn ? (
            <Link href="/account" className="checkout-email-confirm-alt">
              <LogIn className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Use a different account
            </Link>
          ) : (
            <Link href="/sign-in?next=/checkout" className="checkout-email-confirm-alt">
              <LogIn className="h-4 w-4" strokeWidth={1.75} aria-hidden />
              Sign in
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-email-verify">
      <h1 className="checkout-email-verify-title">Verify your email</h1>
      <p className="checkout-email-verify-subtitle">
        Code sent to <strong>{email}</strong>
      </p>

      <div className="checkout-email-verify-form">
        <div className="checkout-email-verify-digits">
          <div className="checkout-email-verify-group">
            {digits.map((digit, index) => (
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
        </div>

        {verifying ? (
          <p className="checkout-email-verify-status">Verifying…</p>
        ) : null}

        {error ? (
          <p className="checkout-email-verify-error">{error}</p>
        ) : null}

        {devCode ? (
          <p className="checkout-email-verify-dev">Dev code: {devCode}</p>
        ) : null}
      </div>

      <div className="checkout-email-verify-links">
        {signedIn ? (
          <Link href="/account" className="checkout-email-verify-link-primary">
            Change email
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setStep("confirm");
              setError("");
              setDevCode(null);
              submittedRef.current = "";
              setDigits(["", "", "", "", "", ""]);
            }}
            className="checkout-email-verify-link-primary"
          >
            Change email
          </button>
        )}
        <div className="checkout-email-verify-link-row">
          <button
            type="button"
            onClick={sendCode}
            disabled={sending}
            className="checkout-email-verify-link-secondary"
          >
            {sending ? "Sending…" : "Resend"}
          </button>
          <span className="checkout-email-verify-link-dot" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => {
              setStep("confirm");
              setError("");
              setDevCode(null);
            }}
            className="checkout-email-verify-link-secondary"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
