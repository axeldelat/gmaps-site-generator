import type {
  Business,
  BusinessPhoto,
  BusinessReview,
} from "@/lib/types";

/**
 * Categorized error for anything that can go wrong talking to Google Places.
 * `userMessage` is safe to show to a non-technical user; the underlying cause
 * is logged server-side, never returned to the client.
 */
export type PlacesErrorKind =
  | "invalid_url"
  | "not_found"
  | "quota"
  | "config"
  | "network"
  | "unknown";

export class PlacesError extends Error {
  readonly kind: PlacesErrorKind;
  readonly userMessage: string;
  readonly httpStatus: number;

  constructor(kind: PlacesErrorKind, userMessage: string, cause?: unknown) {
    super(userMessage);
    this.name = "PlacesError";
    this.kind = kind;
    this.userMessage = userMessage;
    this.httpStatus = HTTP_STATUS_BY_KIND[kind];
    if (cause !== undefined) this.cause = cause;
  }
}

const HTTP_STATUS_BY_KIND: Record<PlacesErrorKind, number> = {
  invalid_url: 400,
  not_found: 404,
  quota: 429,
  config: 500,
  network: 502,
  unknown: 500,
};

const GOOGLE_HOSTS = new Set([
  "maps.google.com",
  "www.google.com",
  "google.com",
  "maps.app.goo.gl",
  "goo.gl",
]);

function requireApiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) {
    throw new PlacesError(
      "config",
      "The site generator is not configured correctly. Please try again later.",
      new Error("GOOGLE_PLACES_API_KEY is not set"),
    );
  }
  return key;
}

/** Map a Google Places API `status` field to our categorized error. */
function errorFromGoogleStatus(status: string, detail?: string): PlacesError {
  switch (status) {
    case "OVER_QUERY_LIMIT":
    case "RESOURCE_EXHAUSTED":
      return new PlacesError(
        "quota",
        "We're a bit busy right now. Please try again in a few minutes.",
        new Error(`Google status ${status}: ${detail ?? ""}`),
      );
    case "NOT_FOUND":
    case "ZERO_RESULTS":
      return new PlacesError(
        "not_found",
        "We couldn't find that business. Please double-check the Google Maps link.",
        new Error(`Google status ${status}: ${detail ?? ""}`),
      );
    case "REQUEST_DENIED":
    case "INVALID_REQUEST":
      return new PlacesError(
        "config",
        "The site generator is not configured correctly. Please try again later.",
        new Error(`Google status ${status}: ${detail ?? ""}`),
      );
    default:
      return new PlacesError(
        "unknown",
        "Something went wrong fetching that business. Please try again.",
        new Error(`Google status ${status}: ${detail ?? ""}`),
      );
  }
}

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch (cause) {
    throw new PlacesError(
      "network",
      "We couldn't reach Google right now. Please try again.",
      cause,
    );
  }
  if (!res.ok) {
    throw new PlacesError(
      res.status === 429 ? "quota" : "unknown",
      "Something went wrong fetching that business. Please try again.",
      new Error(`HTTP ${res.status} from ${url.split("?")[0]}`),
    );
  }
  return (await res.json()) as Record<string, unknown>;
}

/**
 * Resolve a Google Maps URL (full or shortened) to a Place ID.
 *
 * Strategy:
 *  1. Validate the URL points at a Google Maps domain.
 *  2. Follow short-link (maps.app.goo.gl / goo.gl) redirects server-side.
 *  3. Use `query_place_id` directly when present.
 *  4. Otherwise extract the place name from the `/place/<name>/` segment and
 *     resolve it via the Find Place endpoint.
 */
export async function resolvePlaceId(rawUrl: string): Promise<string> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new PlacesError(
      "invalid_url",
      "That doesn't look like a valid link. Please paste a Google Maps business URL.",
    );
  }

  if (!GOOGLE_HOSTS.has(url.hostname)) {
    throw new PlacesError(
      "invalid_url",
      "Please paste a Google Maps link (it should start with maps.google.com or maps.app.goo.gl).",
    );
  }

  // Follow short links to their canonical maps URL.
  if (url.hostname === "maps.app.goo.gl" || url.hostname === "goo.gl") {
    try {
      const res = await fetch(url.toString(), { redirect: "follow" });
      url = new URL(res.url);
    } catch (cause) {
      throw new PlacesError(
        "network",
        "We couldn't open that link. Please try again.",
        cause,
      );
    }
  }

  // Direct place id, if present.
  const queryPlaceId = url.searchParams.get("query_place_id");
  if (queryPlaceId) return queryPlaceId;

  // Extract the place name from the /place/<name>/ path segment.
  const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    // Only now do we need the API key — after the URL is known to be valid.
    return findPlaceIdByText(placeName, requireApiKey());
  }

  throw new PlacesError(
    "invalid_url",
    "We couldn't read a business from that link. Please open the business in Google Maps and copy its URL.",
  );
}

async function findPlaceIdByText(text: string, key: string): Promise<string> {
  const endpoint = new URL(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
  );
  endpoint.searchParams.set("input", text);
  endpoint.searchParams.set("inputtype", "textquery");
  endpoint.searchParams.set("fields", "place_id");
  endpoint.searchParams.set("key", key);

  const data = await fetchJson(endpoint.toString());
  const status = String(data.status);
  if (status !== "OK") {
    throw errorFromGoogleStatus(status, String(data.error_message ?? ""));
  }
  const candidates = data.candidates as Array<{ place_id?: string }> | undefined;
  const placeId = candidates?.[0]?.place_id;
  if (!placeId) {
    throw new PlacesError(
      "not_found",
      "We couldn't find that business. Please double-check the Google Maps link.",
    );
  }
  return placeId;
}

const DETAILS_FIELDS = [
  "place_id",
  "name",
  "formatted_address",
  "formatted_phone_number",
  "website",
  "rating",
  "user_ratings_total",
  "opening_hours",
  "photos",
  "reviews",
].join(",");

/** Fetch place details and normalize them into the internal Business model. */
export async function fetchBusiness(placeId: string): Promise<Business> {
  const key = requireApiKey();

  const endpoint = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  endpoint.searchParams.set("place_id", placeId);
  endpoint.searchParams.set("fields", DETAILS_FIELDS);
  endpoint.searchParams.set("key", key);

  const data = await fetchJson(endpoint.toString());
  const status = String(data.status);
  if (status !== "OK") {
    throw errorFromGoogleStatus(status, String(data.error_message ?? ""));
  }

  const result = data.result as GooglePlaceResult | undefined;
  if (!result) {
    throw new PlacesError(
      "not_found",
      "We couldn't find that business. Please double-check the Google Maps link.",
    );
  }

  return normalizeBusiness(placeId, result);
}

interface GooglePlaceResult {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text?: string[] };
  photos?: Array<{ photo_reference?: string; html_attributions?: string[] }>;
  reviews?: Array<{
    author_name?: string;
    rating?: number;
    text?: string;
    relative_time_description?: string;
    profile_photo_url?: string;
  }>;
}

/** Proxy URL the browser can use to display a photo without seeing the API key. */
export function photoPreviewUrl(ref: string): string {
  return `/api/photo?ref=${encodeURIComponent(ref)}`;
}

function normalizeBusiness(
  placeId: string,
  result: GooglePlaceResult,
): Business {
  const photos: BusinessPhoto[] = (result.photos ?? [])
    .filter((p): p is { photo_reference: string; html_attributions?: string[] } =>
      Boolean(p.photo_reference),
    )
    .map((p) => ({
      ref: p.photo_reference,
      previewUrl: photoPreviewUrl(p.photo_reference),
      attribution: p.html_attributions?.[0],
    }));

  const reviews: BusinessReview[] = (result.reviews ?? [])
    .filter((r) => typeof r.rating === "number")
    .map((r) => ({
      author: r.author_name ?? "Anonymous",
      rating: r.rating as number,
      text: r.text ?? "",
      relativeTime: r.relative_time_description,
      profilePhotoUrl: r.profile_photo_url,
    }));

  const weekdayText = result.opening_hours?.weekday_text ?? [];

  return {
    placeId: result.place_id ?? placeId,
    name: result.name ?? "Your Business",
    address: result.formatted_address,
    phone: result.formatted_phone_number,
    website: result.website,
    rating: result.rating,
    userRatingsTotal: result.user_ratings_total,
    photos,
    hours: weekdayText.length > 0 ? { weekdayText } : undefined,
    reviews,
  };
}

/**
 * Fetch the raw bytes for a photo reference, server-side, using the API key.
 * Used both by the preview proxy and by the deploy bundler.
 */
export async function fetchPhotoBytes(
  ref: string,
  maxWidth = 1600,
): Promise<{ body: ArrayBuffer; contentType: string }> {
  const key = requireApiKey();
  const endpoint = new URL(
    "https://maps.googleapis.com/maps/api/place/photo",
  );
  endpoint.searchParams.set("maxwidth", String(maxWidth));
  endpoint.searchParams.set("photo_reference", ref);
  endpoint.searchParams.set("key", key);

  let res: Response;
  try {
    // The photo endpoint redirects to the actual image; fetch follows it.
    res = await fetch(endpoint.toString(), { redirect: "follow" });
  } catch (cause) {
    throw new PlacesError(
      "network",
      "We couldn't load that image right now. Please try again.",
      cause,
    );
  }
  if (!res.ok) {
    throw new PlacesError(
      res.status === 429 ? "quota" : "not_found",
      "We couldn't load that image.",
      new Error(`HTTP ${res.status} fetching photo`),
    );
  }
  return {
    body: await res.arrayBuffer(),
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  };
}
