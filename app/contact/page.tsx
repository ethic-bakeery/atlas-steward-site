"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const submit = useMutation(api.contact.submit);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await submit({
        name: String(formData.get("name") ?? ""),
        contactInfo: String(formData.get("contactInfo") ?? ""),
        message: String(formData.get("message") ?? ""),
      });
      setSuccess(true);
      event.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setError(t("contact.errGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        {t("contact.kicker")}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">{t("contact.title")}</h1>
      <p className="mt-4 max-w-xl text-ink/70">{t("contact.subtitle")}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="card h-fit space-y-4">
          <h2 className="font-semibold text-navy">{t("contact.infoTitle")}</h2>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              {t("contact.phoneLabel")}
            </p>
            <p className="text-sm text-ink">{siteConfig.contactPhone}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              {t("contact.whatsappLabel")}
            </p>
            <p className="text-sm text-ink">{siteConfig.contactWhatsApp}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              {t("contact.emailLabel")}
            </p>
            <p className="text-sm text-ink">{siteConfig.supportEmail}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              {t("contact.addressLabel")}
            </p>
            <p className="text-sm text-ink">{siteConfig.location}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-navy">{t("contact.formTitle")}</h2>

          {success ? (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {t("contact.success")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-5">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="field-label" htmlFor="name">{t("contact.name")}</label>
                <input className="field-input" id="name" name="name" required />
              </div>
              <div>
                <label className="field-label" htmlFor="contactInfo">{t("contact.contactInfo")}</label>
                <input className="field-input" id="contactInfo" name="contactInfo" required />
              </div>
              <div>
                <label className="field-label" htmlFor="message">{t("contact.message")}</label>
                <textarea className="field-input min-h-[120px]" id="message" name="message" required />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? t("contact.submitting") : t("contact.submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
