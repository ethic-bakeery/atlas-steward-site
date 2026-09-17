"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";

export function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/academy", label: t("nav.academy") },
    { href: "/terms", label: t("nav.terms") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link
          href="/"
          className="shrink-0 flex items-baseline gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-lg font-bold tracking-tight text-navy">
            {siteConfig.shortName}
          </span>
        </Link>

        {/* Desktop nav */}
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

        <div className="hidden items-center gap-3 sm:flex">
          <LanguageToggle />
          <Link href="/register" className="btn-primary whitespace-nowrap">
            {t("nav.join")}
          </Link>
        </div>

        {/* Mobile controls: language toggle stays visible, links move into a menu */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-black/10 text-navy"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="border-t border-black/5 bg-white sm:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-ink/70 transition hover:bg-navy/5 hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              {t("nav.join")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
            }
