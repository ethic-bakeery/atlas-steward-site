"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const bulletSections: { titleKey: TranslationKey; items: TranslationKey[] }[] = [
  { titleKey: "terms.s2Title", items: ["terms.s2i1", "terms.s2i2", "terms.s2i3", "terms.s2i4", "terms.s2i5", "terms.s2i6"] },
  { titleKey: "terms.s3Title", items: ["terms.s3i1", "terms.s3i2", "terms.s3i3", "terms.s3i4", "terms.s3i5", "terms.s3i6"] },
];

export default function TermsPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("terms.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{t("terms.title")}</h1>
      <p className="mt-4 max-w-2xl text-ink/70">{t("terms.intro")}</p>

      {locale === "ha" && t("terms.hausaNote") && (
        <div className="mt-6 max-w-2xl rounded-md border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-ink/80">
          {t("terms.hausaNote")}
        </div>
      )}

      <div className="mt-10 max-w-2xl space-y-8 text-ink/80">
        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s1Title")}</h2>
          <p>{t("terms.s1Body")}</p>
        </section>

        {bulletSections.map((section) => (
          <section key={section.titleKey}>
            <h2 className="text-lg font-semibold text-navy">{t(section.titleKey)}</h2>
            <ul className="list-disc space-y-1.5 pl-5">
              {section.items.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </section>
        ))}

        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s4Title")}</h2>
          <p>{t("terms.s4Body1")}</p>
          <p className="mt-3">{t("terms.s4Body2")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s5Title")}</h2>
          <p>{t("terms.s5Body")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s6Title")}</h2>
          <p>{t("terms.s6Body")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s7Title")}</h2>
          <p>{t("terms.s7Body")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-navy">{t("terms.s8Title")}</h2>
          <p>{t("terms.s8Body")}</p>
        </section>
      </div>
    </div>
  );
}
