"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <section className="bg-navy text-white">
        <div className="container-page flex flex-col gap-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {siteConfig.location}
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="max-w-xl text-lg text-white/80">{t("home.heroSubtitle")}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/register" className="btn-primary bg-gold hover:bg-gold-dark">
              {t("home.ctaApply")}
            </Link>
            <Link
              href="/about"
              className="btn-secondary border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
            >
              {t("home.ctaLearn")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl font-bold text-navy">{t("home.servicesTitle")}</h2>
        <p className="mt-2 max-w-2xl text-ink/70">{t("home.servicesSubtitle")}</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {siteConfig.services.map((service) => (
            <div key={service.key} className="card text-center">
              <p className="font-semibold text-navy">
                {t(`service.${service.key}` as TranslationKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="container-page grid gap-10 py-16 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-gold">01</p>
            <h3 className="mt-2 font-semibold text-navy">{t("home.step1Title")}</h3>
            <p className="mt-1 text-sm text-ink/70">{t("home.step1Body")}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">02</p>
            <h3 className="mt-2 font-semibold text-navy">{t("home.step2Title")}</h3>
            <p className="mt-1 text-sm text-ink/70">{t("home.step2Body")}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">03</p>
            <h3 className="mt-2 font-semibold text-navy">{t("home.step3Title")}</h3>
            <p className="mt-1 text-sm text-ink/70">{t("home.step3Body")}</p>
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-2xl font-bold text-navy">{t("home.becomeTitle")}</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink/70">{t("home.becomeSubtitle")}</p>
        <Link href="/register" className="btn-primary mt-6 inline-flex">
          {t("home.becomeCta")}
        </Link>
      </section>
    </>
  );
}
