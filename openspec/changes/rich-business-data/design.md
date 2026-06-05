## Context

`lib/google/places.ts` fetches Google Places Details with a fixed `DETAILS_FIELDS` list and maps the response to the internal `Business` model (`lib/types.ts`) via `normalizeBusiness`. `Business` is the stable contract everything downstream depends on. Today it carries ~8 fields; Google returns ~25. A live check on Cheester (Playa del Carmen) confirmed the extra fields are populated and useful. This change is the data foundation for the localized rich template and AI copy changes that follow.

## Goals / Non-Goals

**Goals:**
- Capture the useful extra Google fields and expose them as optional, typed, client-safe fields on `Business`.
- Keep every new field optional so partial data never breaks import (the existing degradation guarantee).
- Group related flags into sub-objects so consumers read them cleanly.

**Non-Goals:**
- Rendering any of it (template, badges, map, WhatsApp) — that is `localized-rich-template`.
- Any AI/copy — that is `ai-content-generation`.
- Computing "open now" ourselves from periods — we capture Google's snapshot only (see Decisions).

## Decisions

**1. Group service and dietary flags into sub-objects.**
Add `serviceOptions { dineIn?, takeout?, delivery?, curbsidePickup?, reservable? }` and `serves { breakfast?, brunch?, lunch?, dinner?, beer?, wine?, vegetarian? }` rather than ~12 flat booleans. Rationale: keeps `Business` readable and lets consumers iterate a group to render a badge row. Alternative considered: flat fields — rejected as noisy.

**2. All new fields optional; omit rather than default.**
Missing Google fields are left `undefined`, never coerced to `false`/empty. Rationale: a consumer must be able to tell "Google says no delivery" from "Google didn't say" — only render a badge when the attribute is actually present. (Google returns the booleans only when known, so `undefined` = unknown.)

**3. Capture `current_opening_hours.open_now` as a snapshot `openNow?: boolean`, do not compute.**
Rationale: computing real-time open state belongs to the rendering layer (and for a deployed static site should be computed client-side from periods). This change only surfaces the data Google gives; deriving live state is deferred to `localized-rich-template`. We still request `current_opening_hours` so a later change can use it.

**4. Normalize `types` into a readable `categories: string[]`.**
Pass through Google's `types` array (e.g. `italian_restaurant`, `restaurant`), optionally filtering noise (`establishment`, `point_of_interest`, `food`). Rationale: downstream SEO/schema and AI prompts want the cuisine/category signal. Keep it a simple string array; humanizing the labels is a rendering concern.

**5. `location: { lat, lng }` from `geometry.location`.**
Flatten Google's nested `geometry.location` to a simple `{ lat, lng }`. Rationale: that's all consumers (map embed, geo schema) need.

## Risks / Trade-offs

- **Extra requested fields could raise Places API cost / billing SKU** → Place Details billing is per-call by field group, not per-field within a group; these fields fall into Basic/Contact/Atmosphere groups already largely in use. Trade-off accepted; monitor if needed.
- **`undefined` vs `false` semantics misused downstream** → Documented in the model and Decisions; consumers must check presence before rendering. Mitigated by grouping and comments on the types.
- **Google occasionally omits `editorial_summary`/service flags** → All optional by design; the template change must handle absence per-field.

## Migration Plan

Purely additive to `Business` and to the requested field list. No data migration, no breaking change. Existing imports keep working; new fields simply populate when Google provides them. Rollback = revert the field list and model additions.
