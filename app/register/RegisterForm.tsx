"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB

export function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const generateUploadUrl = useMutation(api.technicians.generateUploadUrl);
  const register = useMutation(api.technicians.register);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!photoFile) {
      setError(t("register.errNeedPhoto"));
      return;
    }
    if (photoFile.size > MAX_PHOTO_BYTES) {
      setError(t("register.errPhotoTooLarge"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const agreedToTerms = formData.get("agreedToTerms") === "on";
    if (!agreedToTerms) {
      setError(t("register.errNeedAgree"));
      return;
    }

    setSubmitting(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": photoFile.type },
        body: photoFile,
      });
      if (!uploadResponse.ok) {
        throw new Error(t("register.errUploadFailed"));
      }
      const { storageId } = await uploadResponse.json();

      await register({
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
        address: String(formData.get("address") ?? ""),
        area: String(formData.get("area") ?? ""),
        serviceCategory: String(formData.get("serviceCategory") ?? ""),
        yearsExperience: Number(formData.get("yearsExperience") ?? 0),
        priorWorkDescription: String(formData.get("priorWorkDescription") ?? ""),
        referenceName: String(formData.get("referenceName") ?? ""),
        referencePhone: String(formData.get("referencePhone") ?? ""),
        photoStorageId: storageId,
        agreedToTerms: true,
      });

      router.push("/register/success");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("register.errGeneric"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="field-label" htmlFor="fullName">{t("register.fullName")}</label>
        <input className="field-input" id="fullName" name="fullName" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="email">{t("register.email")}</label>
          <input className="field-input" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="field-label" htmlFor="phone">{t("register.phone")}</label>
          <input className="field-input" id="phone" name="phone" type="tel" required />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="dateOfBirth">{t("register.dob")}</label>
          <input className="field-input" id="dateOfBirth" name="dateOfBirth" type="date" required />
        </div>
        <div>
          <label className="field-label" htmlFor="area">{t("register.area")}</label>
          <input className="field-input" id="area" name="area" placeholder={t("register.areaPlaceholder")} required />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="address">{t("register.address")}</label>
        <input className="field-input" id="address" name="address" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="serviceCategory">{t("register.serviceCategory")}</label>
          <select className="field-input" id="serviceCategory" name="serviceCategory" required defaultValue="">
            <option value="" disabled>{t("register.selectOne")}</option>
            {siteConfig.services.map((s) => (
              <option key={s.key} value={s.key}>
                {t(`service.${s.key}` as TranslationKey)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="yearsExperience">{t("register.yearsExperience")}</label>
          <input className="field-input" id="yearsExperience" name="yearsExperience" type="number" min={0} step={1} required />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="priorWorkDescription">{t("register.workDescription")}</label>
        <textarea className="field-input min-h-[100px]" id="priorWorkDescription" name="priorWorkDescription" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="referenceName">{t("register.referenceName")}</label>
          <input className="field-input" id="referenceName" name="referenceName" required />
        </div>
        <div>
          <label className="field-label" htmlFor="referencePhone">{t("register.referencePhone")}</label>
          <input className="field-input" id="referencePhone" name="referencePhone" type="tel" required />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="photo">{t("register.photo")}</label>
        <input
          className="field-input file:mr-3 file:rounded file:border-0 file:bg-navy/5 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-navy"
          id="photo"
          name="photo"
          type="file"
          accept="image/*"
          required
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
        <p className="mt-1 text-xs text-ink/50">{t("register.photoHint")}</p>
      </div>

      <div className="flex items-start gap-2 pt-2">
        <input type="checkbox" id="agreedToTerms" name="agreedToTerms" className="mt-1" required />
        <label htmlFor="agreedToTerms" className="text-sm text-ink/70">
          {t("register.agreePrefix")}{" "}
          <Link href="/terms" target="_blank" className="text-navy underline">
            {t("register.agreeLinkText")}
          </Link>
          .
        </label>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? t("register.submitting") : t("register.submit")}
      </button>
    </form>
  );
}
