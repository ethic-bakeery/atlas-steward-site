"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function RegisterSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <div className="card max-w-md">
        <h1 className="text-2xl font-bold text-navy">{t("registerSuccess.title")}</h1>
        <p className="mt-3 text-ink/70">{t("registerSuccess.body")}</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          {t("registerSuccess.backHome")}
        </Link>
      </div>
    </div>
  );
}
