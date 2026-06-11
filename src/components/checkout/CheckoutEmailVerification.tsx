"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = {
  email: string;
  onVerified: () => void;
};

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

export function CheckoutEmailVerification({ email, onVerified }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const submittedRef = useRef("");

  async function sendCode() {
    setSending(true);
    setError("");
    submittedRef.current = "";
    setDigits(["", "", "", "", "", ""]);
    try {
      const res = await fetch("/api/checkout/verify-email/send", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      if (data.devCode) setDevCode(String(data.devCode));
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
      const res = await fetch("/api/checkout/verify-email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
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
    sendCode();
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    const code = digits.join("");
    if (code.length === 6) void confirmCode(code);
  }, [digits]);

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

  return (
    <div className="checkout-email-verify">
      <h1 className="checkout-email-verify-title">Verify your email</h1>
      <p className="checkout-email-verify-subtitle">
        Enter code sent to <strong>{email}</strong>
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

        {error ? (
          <p className="checkout-email-verify-error">{error}</p>
        ) : null}

        {devCode ? (
          <p className="checkout-email-verify-dev">Dev code: {devCode}</p>
        ) : null}
      </div>

      <div className="checkout-email-verify-links">
        <Link href="/account" className="checkout-email-verify-link-primary">
          Change email address
        </Link>
        <button
          type="button"
          onClick={sendCode}
          disabled={sending}
          className="checkout-email-verify-link-secondary"
        >
          {sending ? "Sending..." : "Resend code"}
        </button>
        <Link href="/cart" className="checkout-email-verify-link-secondary">
          Back
        </Link>
      </div>
    </div>
  );
}
