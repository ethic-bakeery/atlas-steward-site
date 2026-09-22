"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const WHATSAPP_NUMBER = "2349030327468"; // update in this file if the number changes

type ServiceDef = {
  key: "cleaning" | "plumbing" | "electrical";
  nameKey: TranslationKey;
  summaryKey: TranslationKey;
  steps: {
    titleKey: TranslationKey;
    detailKey: TranslationKey;
  }[];
};

const services: ServiceDef[] = [
  {
    key: "cleaning",
    nameKey: "service.cleaning",
    summaryKey: "servicesPage.cleaningSummary",
    steps: [
      {
        titleKey: "servicesPage.cleaningStep1Title",
        detailKey: "servicesPage.cleaningStep1Detail",
      },
      {
        titleKey: "servicesPage.cleaningStep2Title",
        detailKey: "servicesPage.cleaningStep2Detail",
      },
      {
        titleKey: "servicesPage.cleaningStep3Title",
        detailKey: "servicesPage.cleaningStep3Detail",
      },
      {
        titleKey: "servicesPage.cleaningStep4Title",
        detailKey: "servicesPage.cleaningStep4Detail",
      },
    ],
  },
  {
    key: "plumbing",
    nameKey: "service.plumbing",
    summaryKey: "servicesPage.plumbingSummary",
    steps: [
      {
        titleKey: "servicesPage.plumbingStep1Title",
        detailKey: "servicesPage.plumbingStep1Detail",
      },
      {
        titleKey: "servicesPage.plumbingStep2Title",
        detailKey: "servicesPage.plumbingStep2Detail",
      },
      {
        titleKey: "servicesPage.plumbingStep3Title",
        detailKey: "servicesPage.plumbingStep3Detail",
      },
      {
        titleKey: "servicesPage.plumbingStep4Title",
        detailKey: "servicesPage.plumbingStep4Detail",
      },
    ],
  },
  {
    key: "electrical",
    nameKey: "service.electrical",
    summaryKey: "servicesPage.electricalSummary",
    steps: [
      {
        titleKey: "servicesPage.electricalStep1Title",
        detailKey: "servicesPage.electricalStep1Detail",
      },
      {
        titleKey: "servicesPage.electricalStep2Title",
        detailKey: "servicesPage.electricalStep2Detail",
      },
      {
        titleKey: "servicesPage.electricalStep3Title",
        detailKey: "servicesPage.electricalStep3Detail",
      },
      {
        titleKey: "servicesPage.electricalStep4Title",
        detailKey: "servicesPage.electricalStep4Detail",
      },
    ],
  },
];

export default function ServicesPage() {
  const { t } = useLanguage();

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t("servicesPage.whatsappMessage")
  )}`;

  const mailtoHref = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
    t("servicesPage.emailSubject")
  )}&body=${encodeURIComponent(t("servicesPage.emailBody"))}`;

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("servicesPage.kicker")}
      </p>

      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
        {t("servicesPage.title")}
      </h1>

      <p className="mt-3 text-sm font-medium text-ink/50">
        {t("servicesPage.brandLine")}
      </p>

      <p className="mt-4 max-w-2xl text-ink/70">
        {t("servicesPage.intro")}
      </p>

      <div className="mt-12 space-y-8">
        {services.map((service) => (
          <div key={service.key} className="card">
            <h2 className="text-xl font-bold text-navy">
              {t(service.nameKey)}
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-ink/70">
              {t(service.summaryKey)}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((step, i) => (
                <div
                  key={step.titleKey}
                  className="rounded-lg bg-navy/[0.03] p-4"
                >
                  <p className="text-xs font-semibold text-gold">
                    {t("servicesPage.stepLabel")} {i + 1}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-navy">
                    {t(step.titleKey)}
                  </p>

                  <p className="mt-1 text-xs text-ink/60">
                    {t(step.detailKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-12 bg-navy text-white">
        <h2 className="text-xl font-bold">
          {t("servicesPage.ctaTitle")}
        </h2>

        <p className="mt-2 max-w-xl text-sm text-white/80">
          {t("servicesPage.ctaBody")}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-gold hover:bg-gold-dark"
          >
            {t("servicesPage.whatsappButton")}
          </a>

          <a
            href={mailtoHref}
            className="btn-secondary border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
          >
            {t("servicesPage.emailButton")}
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink/50">
        {t("servicesPage.browseFirst")}{" "}
        <Link href="/about" className="text-navy underline">
          {t("servicesPage.learnMoreLink")}
        </Link>
        .
      </p>
    </div>
  );
}
