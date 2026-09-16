// Single source of truth for brand text used across the site.
// If the company name changes after trademark/CAC clearance, this is the
// only file that needs to change for the copy (colors live in tailwind.config.ts).

export const siteConfig = {
  name: "Atlas Steward",
  shortName: "Atlas Steward",
  tagline: "Built to Serve. Trained to Care.",
  domain: "atlassteward.com",
  supportEmail: "hello@atlassteward.com",
  // TODO: replace with your real numbers before deploying.
  contactPhone: "+234 000 000 0000",
  contactWhatsApp: "+234 000 000 0000",
  location: "Yola, Adamawa State, Nigeria",
  services: [
    { key: "electrical", label: "Electrical" },
    { key: "plumbing", label: "Plumbing" },
    { key: "solar", label: "Solar & Inverter" },
    { key: "carpentry", label: "Carpentry" },
    { key: "cleaning", label: "Cleaning" },
    { key: "welding", label: "Welding" },
  ],
} as const;

export type ServiceKey = (typeof siteConfig.services)[number]["key"];
