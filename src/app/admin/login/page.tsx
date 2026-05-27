"use client";

import { useState } from "react";
import { TrizenLogo } from "@/components/TrizenLogo";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      let data: { error?: string; ok?: boolean } = {};
      try {
        data = await res.json();
      } catch {
        setError("Server error. Stop dev server, run npm run dev again.");
        return;
      }

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.refresh();
      window.location.replace("/admin");
    } catch {
      setError("Network error. Check npm run dev is running on localhost:3000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-[var(--color-border)] p-8 bg-[var(--color-surface-elevated)]"
      >
        <TrizenLogo variant="on-light" width={48} height={48} className="mx-auto mb-4" />
        <h1 className="text-center text-lg font-bold uppercase tracking-wide mb-6">
          Admin Login
        </h1>
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <Button type="submit" className="w-full mt-6" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
