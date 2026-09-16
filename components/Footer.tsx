"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-navy">{siteConfig.shortName}</p>
          <p>{siteConfig.tagline}</p>
          <p className="mt-1">{siteConfig.location}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/about" className="hover:text-navy">{t("nav.about")}</Link>
          <Link href="/academy" className="hover:text-navy">{t("nav.academy")}</Link>
          <Link href="/terms" className="hover:text-navy">{t("nav.terms")}</Link>
          <Link href="/contact" className="hover:text-navy">{t("nav.contact")}</Link>
          <Link href="/admin/login" className="hover:text-navy">{t("nav.admin")}</Link>
        </div>
      </div>
    </footer>
  );
}
