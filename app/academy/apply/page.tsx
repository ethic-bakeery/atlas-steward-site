"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type TradePreference = "electrical" | "plumbing" | "cleaning";
type EducationLevel = "none" | "primary" | "secondary" | "diploma_ond" | "degree_hnd" | "other";
type ExperienceLevel = "none" | "beginner" | "some" | "experienced";

export default function AcademyApplyPage() {
  const submit = useMutation(api.academyApplications.submit);

  const [tradePreference, setTradePreference] = useState<TradePreference | "">("");
  const [canAttendConsistently, setCanAttendConsistently] = useState<"yes" | "no" | "">("");
  const [hasConflictingCommitment, setHasConflictingCommitment] = useState<"yes" | "no" | "">("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!tradePreference) {
      setError("Please select which trade you're interested in.");
      return;
    }
    if (!canAttendConsistently) {
      setError("Please answer whether you can attend training consistently.");
      return;
    }
    if (!hasConflictingCommitment) {
      setError("Please answer whether you have a conflicting commitment.");
      return;
    }
    if (!experienceLevel) {
      setError("Please select your experience level.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const conflictExplanation = String(formData.get("conflictExplanation") ?? "").trim();
    const experienceExplanation = String(formData.get("experienceExplanation") ?? "").trim();

    if (hasConflictingCommitment === "yes" && !conflictExplanation) {
      setError("Please briefly explain the conflicting commitment you mentioned.");
      return;
    }
    if (experienceLevel !== "none" && !experienceExplanation) {
      setError("Please briefly describe your experience.");
      return;
    }

    setSubmitting(true);
    try {
      await submit({
        fullName: String(formData.get("fullName") ?? "").trim(),
        age: Number(formData.get("age")),
        phone: String(formData.get("phone") ?? "").trim(),
        location: String(formData.get("location") ?? "").trim(),
        emergencyContact: String(formData.get("emergencyContact") ?? "").trim(),
        educationLevel: formData.get("educationLevel") as EducationLevel,
        tradePreference,
        motivation: String(formData.get("motivation") ?? "").trim(),
        canAttendConsistently: canAttendConsistently === "yes",
        hasConflictingCommitment: hasConflictingCommitment === "yes",
        conflictingCommitmentExplanation: conflictExplanation || undefined,
        experienceLevel,
        experienceExplanation: experienceExplanation || undefined,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong submitting your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <div className="card max-w-md">
          <h1 className="text-2xl font-bold text-navy">Application received</h1>
          <p className="mt-3 text-ink/70">
            Thank you for applying to the Astel Academy. Our team will
            review your application and reach out to you by phone with next
            steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        Academy Application
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
        Apply to the Astel Academy
      </h1>
      <p className="mt-4 max-w-xl text-ink/70">
        This first application is short on purpose. If it looks like a good
        fit, we'll reach out to you directly for the next steps.
      </p>

      <form onSubmit={handleSubmit} className="card mt-10 max-w-xl space-y-8">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <h2 className="font-semibold text-navy">Personal information</h2>

          <div>
            <label className="field-label" htmlFor="fullName">Full name</label>
            <input className="field-input" id="fullName" name="fullName" required />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="age">Age</label>
              <input
                className="field-input"
                id="age"
                name="age"
                type="number"
                min={16}
                max={100}
                required
              />
            </div>
            <div>
              <label className="field-label" htmlFor="phone">Phone number</label>
              <input className="field-input" id="phone" name="phone" type="tel" required />
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="location">Location in Yola</label>
            <input
              className="field-input"
              id="location"
              name="location"
              placeholder="e.g. Jimeta, Karewa, Bekaji"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="emergencyContact">Emergency contact</label>
            <input
              className="field-input"
              id="emergencyContact"
              name="emergencyContact"
              placeholder="Name and phone number"
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="educationLevel">
              Highest level of education
            </label>
            <select className="field-input" id="educationLevel" name="educationLevel" required defaultValue="">
              <option value="" disabled>Select one</option>
              <option value="none">No formal education</option>
              <option value="primary">Primary school</option>
              <option value="secondary">Secondary school (SSCE)</option>
              <option value="diploma_ond">Diploma / OND</option>
              <option value="degree_hnd">Degree / HND</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-navy">Trade preference</h2>
          <p className="text-sm text-ink/60">Which area are you interested in?</p>
          <div className="space-y-2">
            {(
              [
                { value: "electrical", label: "Electrical" },
                { value: "plumbing", label: "Plumbing" },
                { value: "cleaning", label: "Cleaning" },
              ] as { value: TradePreference; label: string }[]
            ).map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm has-[:checked]:border-navy has-[:checked]:bg-navy/5"
              >
                <input
                  type="radio"
                  name="tradePreference"
                  value={option.value}
                  checked={tradePreference === option.value}
                  onChange={() => setTradePreference(option.value)}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="motivation">
            Why do you want to learn this skill?
          </label>
          <textarea className="field-input min-h-[100px]" id="motivation" name="motivation" required />
        </div>

        <div className="space-y-5">
          <h2 className="font-semibold text-navy">Commitment</h2>

          <div>
            <p className="field-label">
              Can you attend training consistently for the full training period?
            </p>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm capitalize has-[:checked]:border-navy has-[:checked]:bg-navy/5"
                >
                  <input
                    type="radio"
                    name="canAttendConsistently"
                    value={val}
                    checked={canAttendConsistently === val}
                    onChange={() => setCanAttendConsistently(val)}
                    required
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="field-label">
              Do you currently have another job, school, or commitment that could
              interfere with the training schedule?
            </p>
            <div className="flex gap-3">
              {(["yes", "no"] as const).map((val) => (
                <label
                  key={val}
                  className="flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm capitalize has-[:checked]:border-navy has-[:checked]:bg-navy/5"
                >
                  <input
                    type="radio"
                    name="hasConflictingCommitment"
                    value={val}
                    checked={hasConflictingCommitment === val}
                    onChange={() => setHasConflictingCommitment(val)}
                    required
                  />
                  {val}
                </label>
              ))}
            </div>
            {hasConflictingCommitment === "yes" && (
              <textarea
                className="field-input mt-3 min-h-[80px]"
                name="conflictExplanation"
                placeholder="Please briefly explain"
                required
              />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-navy">Experience</h2>
          <div>
            <label className="field-label" htmlFor="experienceLevel">
              Have you ever done any work in your chosen field?
            </label>
            <select
              className="field-input"
              id="experienceLevel"
              name="experienceLevel"
              required
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
            >
              <option value="" disabled>Select one</option>
              <option value="none">None</option>
              <option value="beginner">Beginner</option>
              <option value="some">Some experience</option>
              <option value="experienced">Experienced</option>
            </select>
          </div>
          {experienceLevel && experienceLevel !== "none" && (
            <textarea
              className="field-input min-h-[80px]"
              name="experienceExplanation"
              placeholder="Briefly explain"
              required
            />
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
