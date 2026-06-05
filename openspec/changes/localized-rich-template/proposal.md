## Why

The first deployed site (Cheester, Playa del Carmen) exposed two problems: the template is hardcoded in **English** ("Welcome to", "Gallery", "Visit Us") — a local-SEO own-goal for a Spanish-speaking restaurant — and it renders only a thin slice of what we now have. Change `rich-business-data` already captures ~25 Google fields (WhatsApp phone, geo, editorial summary, service/dietary attributes, open-now); this change finally **uses** them. Treating the landing as the business's only digital presence, it must do discovery (SEO), trust (real attributes), and conversion (call / directions / WhatsApp) — all in Spanish. This change is intentionally **LLM-free**: it restructures and localizes the template and feeds it real data, leaving AI-written copy to `ai-content-generation`.

## What Changes

- **Localize to Spanish.** Replace all hardcoded English UI strings in the template (sections, labels, footer), set `lang="es"` in the app layout and the deployed HTML.
- **Restructure the template** into: hero (headline + subhead + rating + open-now + CTAs) → service/dietary **badges bar** → "Sobre nosotros" (seeded from `editorialSummary`) → galería → reseñas → "Visítanos" with an **embedded map** → final CTA → footer with full NAP.
- **Conversion actions:** Llamar, Cómo llegar (map + directions link), and a **floating, editable WhatsApp button** (wa.me link; country code + number + message editable, prefilled from `internationalPhone`).
- **Trust badges** derived from real data: 🟢 Abierto ahora, price level, `serves_*` (vegetariano, brunch…), service options (a domicilio, para llevar), ♿ accesible.
- **Local SEO (technical):** generated `<title>` + meta description from real data, `lang="es"`, descriptive image alt text, and **JSON-LD `Restaurant` structured data** (aggregateRating, openingHoursSpecification, geo, address, telephone, priceRange, servesCuisine, service options) in the deployed HTML.
- **Enriched, editable `SiteContent`.** Extend `SiteContent` (heroHeadline, heroSubhead, aboutTitle, aboutBody, ctaTitle, ctaText, plus WhatsApp config) with **non-AI defaults** derived from real data, and expose them all in the editor. Template slots that need AI (rich specialties / why-us / voiced copy) are left for `ai-content-generation` and simply hidden when empty.
- **Out of scope:** any LLM/AI copy generation (that is `ai-content-generation`).

## Capabilities

### New Capabilities
<!-- None. This extends existing generation and editor capabilities. -->

### Modified Capabilities
- `site-generation`: The template gains a localized (Spanish) structure, real-data trust badges, conversion CTAs incl. a floating WhatsApp button, an embedded map, and technical local-SEO output (title/meta, `lang`, alt text, JSON-LD Restaurant schema). Preview and deployed output stay visually identical.
- `site-editor`: The editor expands to edit the enriched text fields and the WhatsApp configuration (enable/disable, country code, number, message).

## Impact

- **`components/SiteTemplate.tsx`** — restructured, localized, badges, map, WhatsApp button; renders enriched `SiteContent`, degrading per-field.
- **`components/templateStyles.ts`** — styles for badges, CTAs, map, floating WhatsApp button.
- **`lib/types.ts`** — `SiteContent` gains `heroHeadline`, `heroSubhead`, `aboutTitle`, `aboutBody`, `ctaTitle`, `ctaText`; new `WhatsAppConfig`; `SiteConfig` gains `whatsapp`.
- **`lib/site-config.ts`** — `buildDefaultSiteConfig` produces Spanish, real-data-derived defaults (aboutBody from `editorialSummary`, WhatsApp from `internationalPhone`).
- **`lib/render/renderHtml.tsx`** — `lang="es"`, richer `<title>`/meta, inject JSON-LD `Restaurant` schema.
- **`lib/seo/` (new)** — helper to build the JSON-LD schema and humanize badges/categories.
- **`components/Editor.tsx`** — fields for enriched content + WhatsApp config.
- **`app/layout.tsx`** — `lang="es"`.
- **No AI** and no changes to import or the deploy/Vercel mechanics (only the HTML content they carry).
