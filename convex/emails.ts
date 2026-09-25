"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

// User-submitted text goes straight into an HTML email body below, so it
// must be escaped first — otherwise someone could submit HTML/script tags
// through the registration or contact form and have them rendered inside
// the notification email itself.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Actions (unlike mutations) are allowed to call external APIs, which is why
// email sending lives here and is only ever triggered via the scheduler from
// technicians.register — it never blocks the applicant's form submission.
export const sendConfirmationEmail = internalAction({
  args: { to: v.string(), fullName: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !from) {
      console.warn(
        "RESEND_API_KEY or RESEND_FROM_EMAIL not set on this Convex deployment — skipping confirmation email."
      );
      return;
    }

    const safeName = escapeHtml(args.fullName);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject: "We've received your Atlas Steward Academy application",
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2430; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1B2A4A;">Thank you, ${safeName}.</h2>
            <p>We've received your application to join the Atlas Steward Academy.</p>
            <p>Our team will review your details and reference, and get back to you
               with next steps. This usually takes a few days.</p>
            <p style="margin-top: 24px;">— The Atlas Steward Team</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resend email failed:", response.status, text);
    }
  },
});

// Notifies the admin inbox whenever someone submits the contact form.
// ADMIN_NOTIFICATION_EMAIL defaults to ADMIN_EMAIL if not set separately.
export const sendContactNotification = internalAction({
  args: { name: v.string(), contactInfo: v.string(), message: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

    if (!apiKey || !from || !to) {
      console.warn(
        "RESEND_API_KEY, RESEND_FROM_EMAIL, or an admin recipient email is not set — skipping contact notification email."
      );
      return;
    }

    const safeName = escapeHtml(args.name);
    const safeContact = escapeHtml(args.contactInfo);
    const safeMessage = escapeHtml(args.message);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New contact message from ${safeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2430; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1B2A4A;">New message via the website</h2>
            <p><strong>From:</strong> ${safeName}</p>
            <p><strong>Contact:</strong> ${safeContact}</p>
            <p style="white-space: pre-wrap;">${safeMessage}</p>
            <p style="margin-top: 24px;">View it in the admin dashboard under "Messages".</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resend email failed:", response.status, text);
    }
  },
});
// Notifies the admin inbox when someone submits the Academy application.
// No applicant confirmation email here — that form doesn't collect an email
// address, only a phone number, so there's nothing to send one to.
export const sendAcademyApplicationNotification = internalAction({
  args: {
    fullName: v.string(),
    phone: v.string(),
    tradePreference: v.union(v.literal("electrical"), v.literal("plumbing"), v.literal("cleaning")),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

    if (!apiKey || !from || !to) {
      console.warn(
        "RESEND_API_KEY, RESEND_FROM_EMAIL, or an admin recipient email is not set — skipping Academy application notification email."
      );
      return;
    }

    const safeName = escapeHtml(args.fullName);
    const safePhone = escapeHtml(args.phone);
    const safeTrade = escapeHtml(args.tradePreference);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        subject: `New Academy application from ${safeName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1f2430; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1B2A4A;">New Academy application</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Trade preference:</strong> ${safeTrade}</p>
            <p style="margin-top: 24px;">View the full application in the admin dashboard under "Academy Applications".</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resend email failed:", response.status, text);
    }
  },
});