"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-black/10 bg-white p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "en" ? "bg-navy text-white" : "text-ink/60 hover:text-navy"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ha")}
        aria-pressed={locale === "ha"}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "ha" ? "bg-navy text-white" : "text-ink/60 hover:text-navy"
        }`}
      >
        HA
      </button>
    </div>
  );
}
