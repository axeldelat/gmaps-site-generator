import type { Business, SiteConfig } from "@/lib/types";

export const DEFAULT_THEME = {
  primaryColor: "#2563eb",
  accentColor: "#f59e0b",
} as const;

/**
 * Build the initial editable SiteConfig from freshly imported business data.
 * Editable text fields are pre-filled with sensible defaults the owner can
 * then tweak in the editor.
 */
export function buildDefaultSiteConfig(business: Business): SiteConfig {
  return {
    business,
    content: {
      businessName: business.name,
      headline: `Welcome to ${business.name}`,
      description: business.address
        ? `Visit us at ${business.address}. We'd love to see you.`
        : "We'd love to welcome you. Get in touch to learn more.",
    },
    theme: { ...DEFAULT_THEME },
  };
}

/** The top reviews to display: highest-rated first, capped at five. */
export function topReviews(business: Business, limit = 5) {
  return [...business.reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
