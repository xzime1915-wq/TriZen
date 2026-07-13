"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Language = "en" | "bn";

const STORAGE_KEY = "trizen-language";
const CHANGE_EVENT = "trizen-language-change";

export function LanguageSwitcher({ className }: { className?: string }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const initial: Language = saved === "bn" ? "bn" : "en";
    setLanguage(initial);
    document.documentElement.lang = initial;

    const sync = (event: Event) => {
      const next = (event as CustomEvent<Language>).detail;
      if (next === "en" || next === "bn") setLanguage(next);
    };

    window.addEventListener(CHANGE_EVENT, sync);
    return () => window.removeEventListener(CHANGE_EVENT, sync);
  }, []);

  function select(next: Language) {
    setLanguage(next);
    document.documentElement.lang = next;
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(
      new CustomEvent<Language>(CHANGE_EVENT, { detail: next }),
    );
  }

  return (
    <div
      className={cn("trizen-language-switcher", className)}
      data-language-static
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={language === "en" ? "is-active" : ""}
        onClick={() => select("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        className={language === "bn" ? "is-active" : ""}
        onClick={() => select("bn")}
        aria-pressed={language === "bn"}
      >
        বাংলা
      </button>
    </div>
  );
}
