"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  theme?: "light" | "dark";
  initialEmail?: string;
  initialFirstName?: string;
  onSuccess?: () => void;
  className?: string;
};

export function SandboxSubscribeForm({
  theme = "light",
  initialEmail = "",
  initialFirstName = "",
  onSuccess,
  className,
}: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const isDark = theme === "dark";

  useEffect(() => {
    if (initialEmail.trim()) setEmail(initialEmail.trim());
    if (initialFirstName.trim()) setFirstName(initialFirstName.trim());
  }, [initialEmail, initialFirstName]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          firstName: firstName.trim(),
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("done");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p
        className={cn(
          "text-sm",
          isDark ? "text-zinc-300" : "text-[var(--color-muted)]",
          className,
        )}
      >
        Thanks, you&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isDark ? "sandbox-subscribe-form sandbox-subscribe-form--dark" : "newsletter-popup-form",
        className,
      )}
    >
      <input
        type="text"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        placeholder="Name"
        autoComplete="given-name"
        className={cn(
          "normal-case tracking-normal placeholder:uppercase",
          isDark ? "sandbox-subscribe-input" : "newsletter-popup-input",
        )}
      />
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="E-mail"
        autoComplete="email"
        className={cn(
          "normal-case tracking-normal placeholder:uppercase",
          isDark ? "sandbox-subscribe-input" : "newsletter-popup-input",
        )}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          isDark ? "sandbox-subscribe-submit" : "newsletter-popup-submit",
        )}
      >
        {status === "loading" ? "..." : "Subscribe"}
      </button>
      {status === "error" ? (
        <p className={cn("text-xs", isDark ? "text-red-300" : "text-red-400")}>
          Could not subscribe. Try again.
        </p>
      ) : null}
    </form>
  );
}
