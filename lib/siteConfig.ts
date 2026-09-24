// Single source of truth for brand text used across the site.
// If the company name changes after trademark/CAC clearance, this is the
// only file that needs to change for the copy (colors live in tailwind.config.ts).

export const siteConfig = {
  name: "Astel",
  shortName: "Astel",
  tagline: "Built to Serve. Trained to Care.",
  domain: "atlassteward.com",
  supportEmail: "hello@astel.ng",
  // TODO: replace with your real numbers before deploying.
  contactPhone: "+234 903 032 7468",
  contactWhatsApp: "+234 903 032 7468",
  location: "Yola, Adamawa State, Nigeria",
  services: [
    { key: "electrical", label: "Electrical" },
    { key: "plumbing", label: "Plumbing" },
    { key: "cleaning", label: "Cleaning" },
  ],
} as const;

export type ServiceKey = (typeof siteConfig.services)[number]["key"];
