## Context

The template (`components/SiteTemplate.tsx`) is the single rendering path for both the in-app preview and the deployed static HTML (`lib/render/renderHtml.tsx` wraps it with `<head>` and `TEMPLATE_CSS`). Today it has hardcoded English section titles, three text fields, and renders ~8 business fields. `rich-business-data` already added ~17 optional fields to `Business`. This change restructures and localizes the template to use them — without any AI. Defaults live in `lib/site-config.ts`; styles in `components/templateStyles.ts`; the deployed `<head>`/`lang` in `renderHtml.tsx`; the app shell `lang` in `app/layout.tsx`.

## Goals / Non-Goals

**Goals:**
- A Spanish, conversion-oriented, SEO-correct landing built from real data.
- Preview and deployed output stay visually identical (one template path).
- Per-field graceful degradation: every new section/badge renders only when its data exists.
- Define the enriched, editable `SiteContent` shape now, with non-AI defaults, so `ai-content-generation` only changes how fields are *filled*, not the template.

**Non-Goals:**
- No AI/LLM copy (that is `ai-content-generation`). Slots that need AI (rich specialties, why-us, voiced intros) are not added here; the template hides empty slots.
- No new map/billing API keys (see Decisions).
- No changes to import or Vercel deploy mechanics.

## Decisions

**1. `SiteContent` grows; AI-only fields are deferred.**
Add `heroHeadline`, `heroSubhead`, `aboutTitle`, `aboutBody`, `ctaTitle`, `ctaText` (keep `headline`/`description`? — replace them; `businessName` stays). Defaults (Spanish, from real data): `aboutBody` ← `editorialSummary`; hero from name + humanized category + locality; CTA generic-but-warm. Rationale: the template needs these slots regardless of who fills them; defining them now means change D just swaps the *source* (defaults → AI) without touching the template. Fields that only make sense AI-written (specialties[], whyUs[]) are intentionally NOT added here.

**2. Floating WhatsApp lives in the template; config on `SiteConfig`.**
Add `WhatsAppConfig { enabled, countryCode, number, message }` and `SiteConfig.whatsapp`. Default: `enabled` when `internationalPhone` exists; parse `countryCode`+`number` from it; Spanish default message. The button is part of `SiteTemplate` so it renders in both preview and deploy. Link: `https://wa.me/<digits>?text=<encoded>`. Rationale: editable per the owner's real number (MX may need the `1` after `52`), and static-deploy-safe (pure anchor).

**3. Embedded map with NO API key.**
Use `https://maps.google.com/maps?q=<lat>,<lng>&z=16&output=embed` in an `<iframe>`, plus a "Cómo llegar" link to `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`. Rationale: the keyless embed avoids provisioning a Maps Embed/Static billing key and works in the deployed static site. Alternative considered: Maps Embed API (needs key) and static map image (needs key + Google attribution) — rejected to keep deploy zero-config.

**4. Badges derived at render time from `Business`, humanized in Spanish.**
A small helper maps known attributes → Spanish labels/icons: `openNow`→🟢 Abierto ahora, `priceLevel`→$$, `serves.vegetarian`→🥗 Opción vegetariana, `serviceOptions.delivery`→🛵 A domicilio, `takeout`→🥡 Para llevar, `wheelchairAccessible`→♿ Accesible, etc. Render only when the value is explicitly `true` (or present). Rationale: never render absence as a negative (the `undefined` = unknown rule from `rich-business-data`).

**5. JSON-LD `Restaurant` schema built in a dedicated `lib/seo/` helper, injected in `renderHtml.tsx`.**
Emit a `<script type="application/ld+json">` with the available facts: `@type: Restaurant`, name, address (PostalAddress parsed best-effort from `formatted_address`), telephone, geo, `aggregateRating` (rating + count), `openingHoursSpecification` (from hours), `priceRange` (from priceLevel), `servesCuisine` (from categories), and service-option booleans (`acceptsReservations`, `hasDelivery`, `hasTakeout`). Only include keys whose data exists. Rationale: this is the highest-leverage local-SEO move; keeping it a pure function keeps it testable and shared.

**6. Localization is static (hardcoded Spanish), not an i18n framework.**
Replace English strings directly; set `lang="es"` in `app/layout.tsx` and `renderHtml.tsx`. Rationale: single target locale (LATAM Spanish) for now; an i18n library is unnecessary weight. English-later is a future change.

**7. Editor stays a flat, simple form.**
Add fields for the enriched content and a WhatsApp group (toggle + country code + number + message). Rationale: matches the existing simple editor; busy non-technical owner. Section visibility is data-driven (no manual show/hide toggles in this change) to keep it simple.

## Risks / Trade-offs

- **Keyless map embed is an undocumented Google endpoint** → It is widely used and static-safe; if it breaks, the "Cómo llegar" link still works, and we can later swap to the official Embed API. Low blast radius (one iframe).
- **`PostalAddress` parsed from `formatted_address` is best-effort** → Schema address may be coarse; we emit `streetAddress`/`addressLocality` when confidently parseable, else fall back to the whole string in `address`. Google still reads partial schema.
- **Replacing `headline`/`description` changes `SiteContent`** → A breaking shape change, but the app holds config in client state only (no persistence) and the deploy reads the current shape; `buildDefaultSiteConfig` is updated in lockstep. Migration is N/A (no stored configs).
- **Preview vs deploy divergence for the map/WhatsApp** → Both render inside `SiteTemplate`, so they appear in both paths by construction; the existing "visually identical" requirement is preserved.
- **Scope is large** → Mitigated by task grouping (types/defaults → template structure → badges/map/WhatsApp → SEO/schema → editor → verify); each group is independently checkable.

## Open Questions

- Exact hero default wording in Spanish before AI lands (placeholder quality) — fine to tune during implementation; AI replaces it in change D.
- Humanized labels for `categories` (e.g. `italian_restaurant` → "Restaurante italiano") — start with a small map + a sensible fallback; expand later.
