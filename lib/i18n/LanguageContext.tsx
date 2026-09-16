"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, TranslationKey } from "./translations";

export type Locale = "en" | "ha";

const STORAGE_KEY = "atlas-steward-locale";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore the visitor's last choice on load (client-only; no effect on
  // the server-rendered HTML, so this can't cause a hydration mismatch
  // beyond a brief flash from English to Hausa if that was their choice).
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ha") {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  function t(key: TranslationKey): string {
    return translations[locale][key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return ctx;
}
