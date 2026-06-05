import type {
  Business,
  BrandVoice,
  SiteConfig,
  WhatsAppConfig,
} from "@/lib/types";
import { humanizeCategory, localityFromAddress } from "@/lib/seo";

export const DEFAULT_THEME = {
  primaryColor: "#2563eb",
  accentColor: "#f59e0b",
} as const;

/** Default WhatsApp prefilled message (Spanish, LATAM). */
export const DEFAULT_WHATSAPP_MESSAGE =
  "¡Hola! Vi su página y quiero hacer un pedido a domicilio 🍝";

/**
 * Build the default WhatsApp config from the business's international phone.
 * Google formats it as "+<cc> <rest>", so we split on the first space to get a
 * clean country code + number. Enabled by default when a number is present.
 */
export function parseWhatsApp(business: Business): WhatsAppConfig {
  const intl = business.internationalPhone?.trim();
  if (!intl) {
    return { enabled: false, countryCode: "", number: "", message: DEFAULT_WHATSAPP_MESSAGE };
  }
  const firstSpace = intl.indexOf(" ");
  let countryCode = "";
  let number = "";
  if (intl.startsWith("+") && firstSpace > 0) {
    countryCode = intl.slice(1, firstSpace).replace(/\D/g, "");
    number = intl.slice(firstSpace + 1).replace(/\D/g, "");
  } else {
    number = intl.replace(/\D/g, "");
  }
  return {
    enabled: number.length > 0,
    countryCode,
    number,
    message: DEFAULT_WHATSAPP_MESSAGE,
  };
}

/**
 * The neutral fallback brand voice, used when the business has no signals
 * (no rating, no price level) to suggest from. Warm and approachable — the
 * safest default for a first website.
 */
export const DEFAULT_BRAND_VOICE: BrandVoice = {
  tone: "amigable",
  vibe: "calido",
  customerFocus: "trato-calido",
};

/**
 * Suggest a brand voice from the imported business signals, so the intake can
 * pre-select a one-tap-to-confirm answer. Pure function, no side effects.
 *
 * Heuristic: higher price level / rating leans premium & classic & quality;
 * lower price level leans friendly & warm. Missing signals fall back to the
 * neutral default. The owner can always change any suggestion in the intake.
 */
export function suggestBrandVoice(business: Business): BrandVoice {
  const { priceLevel, rating } = business;

  // Upscale: expensive places, or highly-rated ones, read as premium.
  if (priceLevel !== undefined ? priceLevel >= 3 : (rating ?? 0) >= 4.6) {
    return { tone: "elegante", vibe: "clasico", customerFocus: "calidad" };
  }

  // Casual: cheap places read as friendly neighborhood spots.
  if (priceLevel !== undefined && priceLevel <= 1) {
    return { tone: "amigable", vibe: "calido", customerFocus: "trato-calido" };
  }

  // Mid-range with a solid rating: warm but with some standing.
  if ((rating ?? 0) >= 4.2) {
    return { tone: "formal", vibe: "caracter", customerFocus: "ambiente" };
  }

  return { ...DEFAULT_BRAND_VOICE };
}

/**
 * Build the initial editable SiteConfig from freshly imported business data.
 * Editable text fields are pre-filled with sensible defaults the owner can
 * then tweak in the editor.
 */
export function buildDefaultSiteConfig(business: Business): SiteConfig {
  const category = humanizeCategory(business.categories);
  const locality = localityFromAddress(business.address);

  // Hero subhead: "<categoría> en <ciudad>" when we can derive both, else a
  // warm generic line. The SEO-optimized copy lands later via AI (change D).
  const heroSubhead =
    category && locality
      ? `${category} en ${locality}`
      : category
        ? category
        : "Te damos la bienvenida.";

  return {
    business,
    content: {
      businessName: business.name,
      heroHeadline: business.name,
      heroSubhead,
      aboutTitle: "Sobre nosotros",
      // Seeded from Google's editorial summary when available; empty otherwise
      // (the about section then hides). AI rewrites this in Spanish in change D.
      aboutBody: business.editorialSummary ?? "",
      ctaTitle: "Te esperamos",
      ctaText: locality
        ? `Ven a vivir la experiencia en ${locality}. Reserva o pasa a vernos.`
        : "Reserva tu lugar o pásate a vernos. Te esperamos con gusto.",
      // Filled by AI (change ai-content-generation); empty render-safe defaults.
      specialties: [],
      whyUs: [],
    },
    theme: { ...DEFAULT_THEME },
    brandVoice: suggestBrandVoice(business),
    whatsapp: parseWhatsApp(business),
  };
}

/** The top reviews to display: highest-rated first, capped at five. */
export function topReviews(business: Business, limit = 5) {
  return [...business.reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}
