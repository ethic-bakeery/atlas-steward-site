"use client";

import Link from "next/link";
import { useLanguage, } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const pipelineKeys: { title: TranslationKey; body: TranslationKey }[] = [
  { title: "academy.step1Title", body: "academy.step1Body" },
  { title: "academy.step2Title", body: "academy.step2Body" },
  { title: "academy.step3Title", body: "academy.step3Body" },
  { title: "academy.step4Title", body: "academy.step4Body" },
  { title: "academy.step5Title", body: "academy.step5Body" },
  { title: "academy.step6Title", body: "academy.step6Body" },
];

const criteriaKeys: TranslationKey[] = [
  "academy.criteria1",
  "academy.criteria2",
  "academy.criteria3",
  "academy.criteria4",
  "academy.criteria5",
  "academy.criteria6",
];

export default function AcademyPage() {
  const { t } = useLanguage();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("academy.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{t("academy.title")}</h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t("academy.subtitle")}</p>

      <h2 className="mt-12 text-xl font-semibold text-navy">{t("academy.pipelineTitle")}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelineKeys.map((step, i) => (
          <div key={step.title} className="card">
            <p className="text-sm font-semibold text-gold">{i + 1}</p>
            <p className="mt-1 font-semibold text-navy">{t(step.title)}</p>
            <p className="mt-1 text-sm text-ink/70">{t(step.body)}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-semibold text-navy">{t("academy.criteriaTitle")}</h2>
      <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-ink/80">
        {criteriaKeys.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>

      <div className="card mt-12 max-w-2xl bg-navy text-white">
        <h3 className="font-semibold">{t("academy.ctaTitle")}</h3>
        <p className="mt-1 text-sm text-white/80">
          {t("academy.ctaBody")}{" "}
          <Link href="/terms" className="underline">
            {t("nav.terms")}
          </Link>
          .
        </p>
        <Link href="/register" className="btn-primary mt-4 inline-flex bg-gold hover:bg-gold-dark">
          {t("academy.ctaButton")}
        </Link>
      </div>
    </div>
  );
}
