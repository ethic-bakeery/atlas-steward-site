"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/translations";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5MB, checked after compression
const MAX_DIMENSION = 1280; // px, longest side
const JPEG_QUALITY = 0.8;
const UPLOAD_ATTEMPTS = 2;

type DecodedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup: () => void;
};

async function decodeImage(file: File): Promise<DecodedImage> {
  try {
    const bitmap = await createImageBitmap(file);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    };
  } catch {
    // Fallback for browsers where createImageBitmap can't decode this file.
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Could not decode image"));
        el.src = url;
      });
      return {
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        cleanup: () => URL.revokeObjectURL(url),
      };
    } catch (err) {
      URL.revokeObjectURL(url);
      throw err;
    }
  }
}

// Shrinks a phone photo to a small JPEG held in memory. This avoids failed
// uploads of multi-megabyte camera photos on weak mobile networks, and
// avoids Android's stale file-handle problem, since the original File is
// read immediately instead of at upload time.
async function compressImage(file: File): Promise<Blob> {
  const decoded = await decodeImage(file);
  try {
    const scale = Math.min(1, MAX_DIMENSION / Math.max(decoded.width, decoded.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(decoded.width * scale));
    canvas.height = Math.max(1, Math.round(decoded.height * scale));

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    ctx.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob) throw new Error("Could not encode image");
    return blob;
  } finally {
    decoded.cleanup();
  }
}

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

    const formData = new FormData(event.currentTarget);
    const agreedToTerms = formData.get("agreedToTerms") === "on";
    if (!agreedToTerms) {
      setError(t("register.errNeedAgree"));
      return;
    }

    setSubmitting(true);
    try {
      // 1. Shrink the photo on the phone before uploading anything.
      let photoBlob: Blob;
      try {
        photoBlob = await compressImage(photoFile);
      } catch (err) {
        console.error("Photo compression failed, using original file:", err);
        photoBlob = photoFile; // e.g. a format this browser can't decode
      }
      if (photoBlob.size > MAX_PHOTO_BYTES) {
        setError(t("register.errPhotoTooLarge"));
        setSubmitting(false);
        return;
      }

      // 2. Upload straight to Convex storage. Retry once with a fresh upload
      //    URL, because mobile connections drop requests more often.
      let storageId: Id<"_storage"> | null = null;
      for (let attempt = 1; attempt <= UPLOAD_ATTEMPTS && !storageId; attempt++) {
        try {
          const uploadUrl = await generateUploadUrl();
          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": photoBlob.type || "image/jpeg" },
            body: photoBlob,
          });
          if (!uploadResponse.ok) {
            throw new Error(`Upload responded with status ${uploadResponse.status}`);
          }
          const json = await uploadResponse.json();
          storageId = json.storageId as Id<"_storage">;
        } catch (err) {
          console.error(`Photo upload attempt ${attempt} failed:`, err);
        }
      }
      if (!storageId) {
        throw new Error(t("register.errUploadFailed"));
      }

      // 3. Submit the rest of the application, referencing the uploaded photo.
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
          <input
            className="field-input"
            id="area"
            name="area"
            placeholder={t("register.areaPlaceholder")}
            required
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="address">{t("register.address")}</label>
        <input className="field-input" id="address" name="address" required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="serviceCategory">
            {t("register.serviceCategory")}
          </label>
          <select
            className="field-input"
            id="serviceCategory"
            name="serviceCategory"
            required
            defaultValue=""
          >
            <option value="" disabled>{t("register.selectOne")}</option>
            {siteConfig.services.map((s) => (
              <option key={s.key} value={s.key}>
                {t(`service.${s.key}` as TranslationKey)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="yearsExperience">
            {t("register.yearsExperience")}
          </label>
          <input
            className="field-input"
            id="yearsExperience"
            name="yearsExperience"
            type="number"
            min={0}
            step={1}
            required
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="priorWorkDescription">
          {t("register.workDescription")}
        </label>
        <textarea
          className="field-input min-h-[100px]"
          id="priorWorkDescription"
          name="priorWorkDescription"
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="referenceName">{t("register.referenceName")}</label>
          <input className="field-input" id="referenceName" name="referenceName" required />
        </div>
        <div>
          <label className="field-label" htmlFor="referencePhone">{t("register.referencePhone")}</label>
          <input
            className="field-input"
            id="referencePhone"
            name="referencePhone"
            type="tel"
            required
          />
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
