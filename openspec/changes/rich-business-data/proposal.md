## Why

We currently normalize ~8 of the ~25 fields the Google Places Details API returns for a business — and the ones we drop are exactly the ones that unlock conversion, trust, local SEO, and better copy. Confirmed real for a live business (Cheester, Playa del Carmen), Google already gives us its own description (`editorial_summary`), an international phone for WhatsApp, geo coordinates for a map, cuisine/category `types`, "open now" state, and rich restaurant attributes (`dine_in`/`takeout`/`delivery`, `serves_*`, wheelchair access). This change captures all of it. It is a pure data-layer change — no UI, no LLM — and is the foundation for the next changes (`localized-rich-template` and `ai-content-generation`), which consume this data.

## What Changes

- Request the full set of useful fields from the Google Places Details API (in addition to the current ones): `international_phone_number`, `url`, `geometry`, `types`, `business_status`, `current_opening_hours`, `editorial_summary`, `dine_in`, `takeout`, `delivery`, `curbside_pickup`, `reservable`, `serves_breakfast`, `serves_brunch`, `serves_lunch`, `serves_dinner`, `serves_beer`, `serves_wine`, `serves_vegetarian_food`, `wheelchair_accessible_entrance`.
- Expand the internal `Business` model with these as **optional** fields (so missing data degrades gracefully, never breaks import): editorial summary, international phone, geo location, categories, business status, open-now, Google Maps URL, grouped `serviceOptions` (dine-in/takeout/delivery/curbside/reservable), grouped `serves` flags, and wheelchair accessibility.
- Normalize the new raw fields into stable, client-safe shapes in `normalizeBusiness`.
- **Out of scope:** rendering any of this (template/badges/map/WhatsApp = change `localized-rich-template`), and any AI copy (change `ai-content-generation`). This change only makes the data available on `Business`.

## Capabilities

### New Capabilities
<!-- None. This extends the existing import capability. -->

### Modified Capabilities
- `business-data-import`: The fetch/normalize requirements expand to retrieve and expose a richer set of business attributes (contact, location, category, status, service options, and dietary/meal attributes), all optional and degrading gracefully when absent.

## Impact

- **Data model** (`lib/types.ts`): `Business` gains optional fields — `editorialSummary`, `internationalPhone`, `googleMapsUrl`, `location { lat, lng }`, `categories[]`, `businessStatus`, `openNow`, `serviceOptions { dineIn?, takeout?, delivery?, curbsidePickup?, reservable? }`, `serves { breakfast?, brunch?, lunch?, dinner?, beer?, wine?, vegetarian? }`, `wheelchairAccessible`.
- **Extraction** (`lib/google/places.ts`): expanded `DETAILS_FIELDS`, expanded `GooglePlaceResult` interface, and expanded `normalizeBusiness` mapping.
- **No changes** to the template, editor, deploy, or any UI. Downstream consumers (changes C and D) read these new fields; nothing renders them yet.
- All new fields are optional — existing behavior for businesses without them is unchanged.
