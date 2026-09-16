"use client";

import { RegisterForm } from "./RegisterForm";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("register.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{t("register.title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("register.subtitle")}</p>

      <div className="mt-10 max-w-xl">
        <RegisterForm />
      </div>
    </div>
  );
}
