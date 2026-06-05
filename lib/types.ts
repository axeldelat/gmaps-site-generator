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

/** Geographic coordinates, flattened from Google's `geometry.location`. */
export interface BusinessLocation {
  lat: number;
  lng: number;
}

/**
 * Service options Google reports for a place. Every flag is optional: `undefined`
 * means Google didn't say (unknown), NOT "no". Only render a badge when the
 * value is explicitly present.
 */
export interface ServiceOptions {
  dineIn?: boolean;
  takeout?: boolean;
  delivery?: boolean;
  curbsidePickup?: boolean;
  reservable?: boolean;
}

/**
 * Meal/dietary attributes Google reports. Same optional semantics as
 * ServiceOptions: `undefined` = unknown, not "no".
 */
export interface Serves {
  breakfast?: boolean;
  brunch?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  beer?: boolean;
  wine?: boolean;
  vegetarian?: boolean;
}

export interface Business {
  placeId: string;
  name: string;
  address?: string;
  phone?: string;
  /** International-format phone (e.g. "+52 984 169 7524"), ideal for WhatsApp links. */
  internationalPhone?: string;
  website?: string;
  /** Link to the business's Google Maps profile. */
  googleMapsUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
  /** Google price level, 0 (free) – 4 (very expensive). Often absent. */
  priceLevel?: number;
  /** Google's own editorial description of the place, when available. */
  editorialSummary?: string;
  /** Geographic coordinates, for maps and geo structured data. */
  location?: BusinessLocation;
  /** Google place types/categories (e.g. ["italian_restaurant", "restaurant"]). */
  categories?: string[];
  /** Google business status, e.g. "OPERATIONAL", "CLOSED_TEMPORARILY". */
  businessStatus?: string;
  /** Snapshot of whether the place was open at fetch time (not live). */
  openNow?: boolean;
  serviceOptions?: ServiceOptions;
  serves?: Serves;
  /** Whether the entrance is wheelchair accessible, when known. */
  wheelchairAccessible?: boolean;
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

/** A single highlighted dish/service, grounded in real data (reviews). */
export interface Specialty {
  title: string;
  description: string;
}

export interface SiteContent {
  /** Business name shown in the header (defaults to business.name). */
  businessName: string;
  /** Hero H1. */
  heroHeadline: string;
  /** Hero supporting line under the H1. */
  heroSubhead: string;
  /** "Sobre nosotros" section heading. */
  aboutTitle: string;
  /** "Sobre nosotros" body; default seeded from the business editorial summary. */
  aboutBody: string;
  /** Final call-to-action heading. */
  ctaTitle: string;
  /** Final call-to-action supporting text. */
  ctaText: string;
  /** AI-generated specialties (empty until generated). */
  specialties: Specialty[];
  /** AI-generated "why choose us" points (empty until generated). */
  whyUs: string[];
  /** AI-generated SEO meta description; falls back to other copy when absent. */
  metaDescription?: string;
}

/**
 * Floating WhatsApp button configuration. Prefilled from the business's
 * international phone when available; fully editable by the owner (the country
 * code / number split and the MX "1" quirk are theirs to confirm).
 */
export interface WhatsAppConfig {
  enabled: boolean;
  /** Country calling code digits, e.g. "52". */
  countryCode: string;
  /** Local number digits, no country code, e.g. "9841697524". */
  number: string;
  /** Prefilled message text. */
  message: string;
}

/**
 * The business's brand personality, captured in the intake step as a small set
 * of closed-choice dimensions (no free text). Downstream copy generation
 * (change `ai-content-generation`) consumes this to set the writing voice.
 */
export type Tone = "amigable" | "formal" | "divertido" | "elegante";
export type Vibe = "caracter" | "calido" | "energico" | "clasico";
export type CustomerFocus = "rapido" | "trato-calido" | "calidad" | "ambiente";

export interface BrandVoice {
  /** How the page should feel — sets the writing register. */
  tone: Tone;
  /** The business's overall vibe. */
  vibe: Vibe;
  /** What the owner values most with customers — the value proposition. */
  customerFocus: CustomerFocus;
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
  /** Brand personality captured in the intake step. */
  brandVoice: BrandVoice;
  /** Floating WhatsApp button configuration. */
  whatsapp: WhatsAppConfig;
}
