## 1. Data model

- [x] 1.1 Add a `BusinessLocation { lat, lng }` interface and grouped `ServiceOptions` / `Serves` interfaces (all fields optional booleans) to `lib/types.ts`
- [x] 1.2 Extend the `Business` interface with optional fields: `editorialSummary?`, `internationalPhone?`, `googleMapsUrl?`, `location?`, `categories?`, `businessStatus?`, `openNow?`, `serviceOptions?`, `serves?`, `wheelchairAccessible?`

## 2. Extraction

- [x] 2.1 Add the new fields to `DETAILS_FIELDS` in `lib/google/places.ts` (`international_phone_number`, `url`, `geometry`, `types`, `business_status`, `current_opening_hours`, `editorial_summary`, `dine_in`, `takeout`, `delivery`, `curbside_pickup`, `reservable`, `serves_breakfast`, `serves_brunch`, `serves_lunch`, `serves_dinner`, `serves_beer`, `serves_wine`, `serves_vegetarian_food`, `wheelchair_accessible_entrance`)
- [x] 2.2 Extend the `GooglePlaceResult` interface with the corresponding raw field types
- [x] 2.3 Map the new raw fields in `normalizeBusiness`: editorial summary (`editorial_summary.overview`), `internationalPhone`, `googleMapsUrl` (`url`), `location` (from `geometry.location`), `categories` (filtered `types`), `businessStatus`, `openNow` (`current_opening_hours.open_now`), grouped `serviceOptions`, grouped `serves`, `wheelchairAccessible` — leaving each `undefined` when Google omits it

## 3. Verification

- [x] 3.1 Run typecheck and build; confirm no type errors
- [x] 3.2 Verify against a real place (e.g. Cheester) that the new fields populate on the normalized `Business`, and that a place missing some fields still normalizes without error
