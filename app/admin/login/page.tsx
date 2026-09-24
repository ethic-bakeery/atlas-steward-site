"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="container-page flex justify-center py-24">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-5">
        <div>
          <h1 className="text-xl font-bold text-navy">Admin login</h1>
          <p className="mt-1 text-sm text-ink/60">
            Astel technician management.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input className="field-input" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input className="field-input" id="password" name="password" type="password" required />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
