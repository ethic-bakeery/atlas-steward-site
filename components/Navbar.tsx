"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const { t } = useLanguage();

  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/academy", label: t("nav.academy") },
    { href: "/terms", label: t("nav.terms") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-navy">
            {siteConfig.shortName}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/register" className="btn-primary whitespace-nowrap">
            {t("nav.join")}
          </Link>
        </div>
      </div>
    </header>
  );
}
