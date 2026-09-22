import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const WHATSAPP_NUMBER = "2349030327468"; // update in this file if the number changes
const WHATSAPP_MESSAGE =
  "Hello, this is regarding ASTEL's (Atlas Steward) home services — I'd like to know more about your cleaning, plumbing, or electrical services.";
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

const EMAIL_SUBJECT = "Inquiry about ASTEL services";
const EMAIL_BODY =
  "Hello ASTEL team,\n\nI would like to know more about your cleaning, plumbing, or electrical services.\n\n";
const mailtoHref = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${encodeURIComponent(EMAIL_BODY)}`;

type Service = {
  key: string;
  name: string;
  summary: string;
  steps: { title: string; detail: string }[];
};

const services: Service[] = [
  {
    key: "cleaning",
    name: "Cleaning",
    summary:
      "Thorough, checklist-driven cleaning for homes and businesses — nothing left to guesswork.",
    steps: [
      {
        title: "Walkthrough",
        detail: "We review the space with you and confirm exactly what needs cleaning.",
      },
      {
        title: "Confirmed scope",
        detail: "You get a clear price and checklist before we start — no surprises.",
      },
      {
        title: "Careful work",
        detail: "Our Steward cleans following the agreed checklist, room by room.",
      },
      {
        title: "Final check",
        detail: "We walk through the result with you before we leave.",
      },
    ],
  },
  {
    key: "plumbing",
    name: "Plumbing",
    summary:
      "From leaks to installations, handled by technicians who explain what's wrong before they touch anything.",
    steps: [
      {
        title: "Diagnosis",
        detail: "We inspect the issue and explain what's wrong in plain language.",
      },
      {
        title: "Confirmed quote",
        detail: "You approve the price before any work begins.",
      },
      {
        title: "Safety-checked repair",
        detail: "Work is carried out following our safety checklist.",
      },
      {
        title: "Tested together",
        detail: "We test the fix with you present before calling the job done.",
      },
    ],
  },
  {
    key: "electrical",
    name: "Electrical",
    summary:
      "Wiring, fixtures, and repairs done to a safety standard we hold every technician to, every time.",
    steps: [
      {
        title: "Safety assessment",
        detail: "We check the wiring or fixture and any risks before touching anything.",
      },
      {
        title: "Confirmed quote",
        detail: "Price is agreed with you upfront — no on-site changes without approval.",
      },
      {
        title: "Checklist-driven work",
        detail: "Every step follows the Atlas safety checklist, without exception.",
      },
      {
        title: "Power tested",
        detail: "We confirm everything works safely before we leave.",
      },
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">
        Our Services
      </p>
      <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
        Professional people. Trusted service.
      </h1>
      <p className="mt-3 text-sm font-medium text-ink/50">
        ASTEL — a company by {siteConfig.name}
      </p>
      <p className="mt-4 max-w-2xl text-ink/70">
        We currently offer three services in {siteConfig.location}: cleaning,
        plumbing, and electrical work. Every job follows the same standard —
        a confirmed price, a safety checklist, and a technician who is
        accountable for the result.
      </p>

      {/* Service breakdown */}
      <div className="mt-12 space-y-8">
        {services.map((service) => (
          <div key={service.key} className="card">
            <h2 className="text-xl font-bold text-navy">{service.name}</h2>
            <p className="mt-1 max-w-2xl text-sm text-ink/70">{service.summary}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((step, i) => (
                <div key={step.title} className="rounded-lg bg-navy/[0.03] p-4">
                  <p className="text-xs font-semibold text-gold">Step {i + 1}</p>
                  <p className="mt-1 text-sm font-semibold text-navy">{step.title}</p>
                  <p className="mt-1 text-xs text-ink/60">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="card mt-12 bg-navy text-white">
        <h2 className="text-xl font-bold">Ready to get started?</h2>
        <p className="mt-2 max-w-xl text-sm text-white/80">
          Reach us on WhatsApp or by email — both are checked directly by our
          customer service team, who will respond to you personally.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary bg-gold hover:bg-gold-dark"
          >
            Chat with us on WhatsApp
          </a>
          
            href={mailtoHref}
            className="btn-secondary border-white/30 bg-transparent text-white hover:border-white/50 hover:bg-white/10"
          >
            Email us
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-ink/50">
        Prefer to browse first?{" "}
        <Link href="/about" className="text-navy underline">
          Learn more about {siteConfig.name}
        </Link>
        .
      </p>
    </div>
  );
}