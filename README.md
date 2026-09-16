# Atlas Steward — Website & Technician Onboarding

Next.js (App Router) + TypeScript + Convex + Tailwind. Public marketing pages,
an Academy application form with passport-photo upload, and a
password-protected admin dashboard for reviewing applicants.

This was written without a live internet connection, so it has **not been
run, installed, or built** in this environment. Follow the steps below in an
environment with internet access (your own machine) — that's where you'll
catch anything that needs a small fix.

## What's here

```
app/                    Pages (App Router)
  page.tsx              Home
  about/                About page
  academy/               Academy pipeline + criteria
  terms/                 Terms & conditions (draft — see note below)
  register/              Public application form + success page
  admin/login/            Admin sign-in
  admin/dashboard/        Protected: applicant list + detail/approve/reject
  api/admin/              Login/logout route handlers
convex/
  schema.ts              Database schema (technicians table)
  technicians.ts          Register, list, getById, updateStatus, upload URL
  emails.ts               Sends the applicant confirmation email (Resend)
lib/
  siteConfig.ts           Brand name/tagline/services — edit here to rename
  session.ts              Signed-cookie helpers for the one admin account
  convexServer.ts          Server-side Convex calls used by admin pages
middleware.ts             Blocks /admin/dashboard/* without a valid session
```

## 1. Install

```bash
npm install
```

## 2. Set up Convex (the database + backend)

```bash
npx convex dev
```

First run will open a browser to log in / create a free Convex account and
create a project. It will also write `NEXT_PUBLIC_CONVEX_URL` into
`.env.local` automatically. **Leave this command running** in its own
terminal while you develop — it pushes your `convex/` code live and
regenerates the `convex/_generated` folder that the app imports from.

Then set the two secrets Convex needs (separate from your `.env.local`,
these live in Convex's own environment):

```bash
npx convex env set ADMIN_API_SECRET "a-long-random-string"
npx convex env set RESEND_API_KEY "your-resend-api-key"
npx convex env set RESEND_FROM_EMAIL "Atlas Steward Academy <onboarding@resend.dev>"
npx convex env set ADMIN_EMAIL "the-inbox-that-should-get-contact-form-alerts@example.com"
```

`ADMIN_EMAIL` here is used only to decide where contact-form notification
emails go (you can set `ADMIN_NOTIFICATION_EMAIL` instead if you want that
separate from the admin login email in your `.env.local`).

Sign up for a free [Resend](https://resend.com) account to get an API key.
You can start with their `onboarding@resend.dev` sandbox sender before
you've verified your own domain.

## 3. Set up your local environment

```bash
cp .env.local.example .env.local
```

Fill in:
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the one admin login for this app
- `COOKIE_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `ADMIN_API_SECRET` — **must be the exact same value** you set with
  `npx convex env set ADMIN_API_SECRET` above

`NEXT_PUBLIC_CONVEX_URL` should already be filled in from step 2.

## 4. Run it locally

In one terminal: `npx convex dev` (if not already running)
In another: `npm run dev`

Visit `http://localhost:3000`. Submit a test application at `/register`,
then log in at `/admin/login` with the credentials from `.env.local` to see
it in the dashboard.

## 5. Deploy

**Backend + frontend together, via Vercel:**

1. Push this project to a GitHub repository.
2. Create a Vercel project and link it to that repo.
3. In Vercel's project settings, override the **Build Command** to:
   ```
   npx convex deploy --cmd 'npm run build'
   ```
4. On the [Convex dashboard](https://dashboard.convex.dev), open your
   project's **production** deployment settings and generate a
   **Production Deploy Key**.
5. In Vercel → Environment Variables, add `CONVEX_DEPLOY_KEY` with that key
   (Production environment only).
6. Also add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `COOKIE_SECRET`, and
   `ADMIN_API_SECRET` as Vercel environment variables (same values as your
   `.env.local`).
7. Re-run `npx convex env set ADMIN_API_SECRET / RESEND_API_KEY / RESEND_FROM_EMAIL`
   against your **production** Convex deployment (the CLI will ask which
   deployment, or use `--prod`).
8. Deploy. Vercel will run `npx convex deploy` (pushing your Convex
   functions to production) and then build the Next.js app.

You do **not** need to buy `atlassteward.com` before doing any of this —
Vercel gives you a free `*.vercel.app` URL to test on first. Add the custom
domain in Vercel's project settings once you've bought it.

## Known gaps to be aware of

- **Brand/name clearance:** "Atlas Steward" hasn't been through a CAC or
  trademark check yet. `lib/siteConfig.ts` is the single file to edit if the
  name changes.
- **Terms & conditions:** the `/terms` page is a working draft in plain
  language, not lawyer-reviewed. Say so on the page until it has been.
- **Single shared admin login:** fine for one admin today; if more than one
  person needs dashboard access, this should become real per-user
  authentication (e.g. Convex Auth) rather than one shared password.
- **No automated tests.** Test the registration → email → admin approval
  flow by hand before relying on it for real applicants.
- **Basic spam protection only** on the public registration and contact
  forms (none, currently) — worth adding a honeypot field or simple rate
  limiting if they get abused.
- **Hausa translations are AI-drafted, not verified by a native speaker.**
  Everyday navigation and form text is low-risk if slightly off. The Terms
  page is higher-stakes — since the entire point of translating it is that
  someone who can't read English still understands what they're agreeing
  to, get that page specifically checked by a fluent Hausa speaker before
  relying on it with real applicants. The Hausa Terms page currently
  includes a line inviting applicants to ask staff directly if anything is
  unclear, as a safety net in the meantime.
- The language toggle (`lib/i18n/`) currently supports English and Hausa
  only, with the dictionary structured so a third language (e.g. Fulfulde)
  is a matter of adding another object, not restructuring anything.
