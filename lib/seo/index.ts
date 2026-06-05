import type { Business, SiteConfig } from "@/lib/types";

// Spanish labels for common Google place categories. Falls back to undefined
// when we don't have a confident humanized label (callers degrade gracefully).
const CATEGORY_LABELS: Record<string, string> = {
  italian_restaurant: "Restaurante italiano",
  mexican_restaurant: "Restaurante mexicano",
  seafood_restaurant: "Restaurante de mariscos",
  pizza_restaurant: "Pizzería",
  japanese_restaurant: "Restaurante japonés",
  chinese_restaurant: "Restaurante chino",
  sushi_restaurant: "Restaurante de sushi",
  steak_house: "Restaurante de carnes",
  vegetarian_restaurant: "Restaurante vegetariano",
  vegan_restaurant: "Restaurante vegano",
  fast_food_restaurant: "Comida rápida",
  hamburger_restaurant: "Hamburguesería",
  taco_restaurant: "Taquería",
  bar: "Bar",
  cafe: "Cafetería",
  coffee_shop: "Cafetería",
  bakery: "Panadería",
  ice_cream_shop: "Heladería",
  restaurant: "Restaurante",
};

/** Best human-readable Spanish category label, preferring the most specific. */
export function humanizeCategory(categories?: string[]): string | undefined {
  if (!categories || categories.length === 0) return undefined;
  // Prefer a specific match over the generic "restaurant".
  const specific = categories.find(
    (c) => CATEGORY_LABELS[c] && c !== "restaurant",
  );
  if (specific) return CATEGORY_LABELS[specific];
  const any = categories.find((c) => CATEGORY_LABELS[c]);
  return any ? CATEGORY_LABELS[any] : undefined;
}

/**
 * Best-effort locality (city) from a Google formatted address. Looks for the
 * "<postal code> <City>" component first, then falls back to the component
 * before the state/country tail.
 */
export function localityFromAddress(address?: string): string | undefined {
  if (!address) return undefined;
  const parts = address.split(",").map((s) => s.trim());
  for (const p of parts) {
    const m = p.match(/^\d{4,6}\s+(.+)$/);
    if (m) return m[1];
  }
  return parts.length >= 3 ? parts[parts.length - 3] : undefined;
}

export interface Badge {
  icon: string;
  label: string;
}

/**
 * Trust badges derived ONLY from explicitly-present business attributes.
 * Never renders absence as a negative (an `undefined` flag is skipped).
 */
export function buildBadges(b: Business): Badge[] {
  // Note: open-now is rendered in the hero (next to the rating), not here.
  const out: Badge[] = [];
  if (typeof b.priceLevel === "number" && b.priceLevel > 0) {
    out.push({ icon: "", label: "$".repeat(Math.min(4, b.priceLevel)) });
  }
  if (b.serves?.vegetarian) out.push({ icon: "🥗", label: "Opción vegetariana" });
  if (b.serves?.brunch) out.push({ icon: "🥐", label: "Brunch" });
  if (b.serviceOptions?.delivery) out.push({ icon: "🛵", label: "A domicilio" });
  if (b.serviceOptions?.takeout) out.push({ icon: "🥡", label: "Para llevar" });
  if (b.serviceOptions?.dineIn) out.push({ icon: "🍽️", label: "Para comer aquí" });
  if (b.serviceOptions?.reservable) out.push({ icon: "📅", label: "Acepta reservas" });
  if (b.wheelchairAccessible) out.push({ icon: "♿", label: "Accesible" });
  return out;
}

/**
 * Build a JSON-LD `Restaurant` object from the available facts. Only includes
 * keys whose data is present, using standard, well-supported schema.org fields.
 * Opening hours are intentionally omitted (parsing weekday text reliably is
 * brittle); the included facts are enough for rich results.
 */
export function buildRestaurantJsonLd(config: SiteConfig): Record<string, unknown> {
  const b = config.business;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: config.content.businessName || b.name,
  };
  if (b.address) ld.address = b.address;
  if (b.internationalPhone || b.phone) ld.telephone = b.internationalPhone || b.phone;
  if (b.website) ld.url = b.website;
  if (b.location) {
    ld.geo = {
      "@type": "GeoCoordinates",
      latitude: b.location.lat,
      longitude: b.location.lng,
    };
  }
  if (typeof b.rating === "number") {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: b.rating,
      ...(b.userRatingsTotal ? { reviewCount: b.userRatingsTotal } : {}),
    };
  }
  if (typeof b.priceLevel === "number" && b.priceLevel > 0) {
    ld.priceRange = "$".repeat(Math.min(4, b.priceLevel));
  }
  const cuisine = humanizeCategory(b.categories);
  if (cuisine) ld.servesCuisine = cuisine;
  if (b.serviceOptions?.reservable) ld.acceptsReservations = true;
  if (b.photos[0]) ld.image = b.photos[0].previewUrl;
  return ld;
}
