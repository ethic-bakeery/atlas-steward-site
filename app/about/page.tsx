"use client";

import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("about.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{siteConfig.name}</h1>
      <div className="mt-8 max-w-2xl space-y-5 text-ink/80">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>{t("about.p3")}</p>

        <h2 className="pt-4 text-xl font-semibold text-navy">{t("about.promiseTitle")}</h2>
        <p>{t("about.promiseBody")}</p>

        <h2 className="pt-4 text-xl font-semibold text-navy">{t("about.futureTitle")}</h2>
        <p>{t("about.futureBody")}</p>
      </div>
    </div>
  );
}
