// Normalized internal data model. Everything downstream (template, editor,
// deploy) depends on these types — NOT on the raw Google Places response shape.
// This is the single place that must change if the Places API changes.

export interface BusinessReview {
  author: string;
  /** 1–5 star rating. */
  rating: number;
  text: string;
  /** Human-readable relative time, e.g. "2 months ago". */
  relativeTime?: string;
  profilePhotoUrl?: string;
}

export interface BusinessHours {
  /** One entry per weekday, e.g. "Monday: 9:00 AM – 5:00 PM". */
  weekdayText: string[];
}

export interface BusinessPhoto {
  /**
   * Google photo reference. Safe to send to the client (it is not the API key),
   * but only usable server-side together with the key to fetch the actual image.
   */
  ref: string;
  /** App proxy URL used for the in-app preview, e.g. /api/photo?ref=... */
  previewUrl: string;
  /** Required attribution markup/text from Google, if provided. */
  attribution?: string;
}

export interface Business {
  placeId: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  photos: BusinessPhoto[];
  hours?: BusinessHours;
  reviews: BusinessReview[];
}

export interface SiteTheme {
  /** CSS color, e.g. "#2563eb". */
  primaryColor: string;
  /** CSS color, e.g. "#f59e0b". */
  accentColor: string;
}

export interface SiteContent {
  /** Business name shown in the header (defaults to business.name). */
  businessName: string;
  headline: string;
  description: string;
}

/**
 * The complete, self-contained description of a site. This is what the editor
 * mutates, what the preview renders, and what is shipped (as site.config.json)
 * at deploy time.
 */
export interface SiteConfig {
  business: Business;
  content: SiteContent;
  theme: SiteTheme;
}
