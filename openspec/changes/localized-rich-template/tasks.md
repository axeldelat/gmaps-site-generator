## 1. Data model & defaults

- [x] 1.1 Replace `SiteContent.headline`/`description` with enriched fields: `heroHeadline`, `heroSubhead`, `aboutTitle`, `aboutBody`, `ctaTitle`, `ctaText` (keep `businessName`) in `lib/types.ts`
- [x] 1.2 Add `WhatsAppConfig { enabled, countryCode, number, message }` and `SiteConfig.whatsapp` in `lib/types.ts`
- [x] 1.3 Update `buildDefaultSiteConfig` in `lib/site-config.ts` to produce Spanish, real-data-derived defaults (aboutBody ← `editorialSummary`; hero from name + humanized category + locality; CTA warm default)
- [x] 1.4 Add a `parseWhatsApp(business)` default helper: enabled when `internationalPhone` exists, parsing country code + number, with a Spanish default message

## 2. SEO & helpers (`lib/seo/`)

- [x] 2.1 Add a category humanizer (e.g. `italian_restaurant` → "Restaurante italiano") with a sensible fallback
- [x] 2.2 Add a badge builder: map real `Business` attributes (openNow, priceLevel, serves.*, serviceOptions.*, wheelchairAccessible) → Spanish `{icon,label}` list, including only explicitly-present values
- [x] 2.3 Add a `buildRestaurantJsonLd(config)` pure function producing the JSON-LD `Restaurant` object from available facts (name, address, telephone, geo, aggregateRating, openingHoursSpecification, priceRange, servesCuisine, service options)

## 3. Template structure & localization

- [x] 3.1 Restructure `components/SiteTemplate.tsx`: hero (heroHeadline, heroSubhead, rating, 🟢 open-now, CTAs Llamar/Cómo llegar), then badges bar, Sobre nosotros, Galería, Lo que dicen, Visítanos (+map), CTA final, footer with full NAP
- [x] 3.2 Translate all hardcoded section titles/labels/footer to Spanish; descriptive image `alt` text (business name + context, not "photo 2")
- [x] 3.3 Render trust badges from the badge builder (only when data present)
- [x] 3.4 Add the embedded map (keyless `output=embed` iframe) + "Cómo llegar" directions link, shown only when `location` exists
- [x] 3.5 Add the floating, editable WhatsApp button (wa.me link from `whatsapp` config), shown only when enabled with a number
- [x] 3.6 Add styles to `components/templateStyles.ts` for badges, CTAs, map, and the floating WhatsApp button (preview + deploy share these)

## 4. Localization & SEO in the shell

- [x] 4.1 Set `lang="es"` in `app/layout.tsx` and update its metadata to Spanish
- [x] 4.2 In `lib/render/renderHtml.tsx`: `lang="es"`, build `<title>` + meta description from real data, and inject the JSON-LD `Restaurant` `<script>`

## 5. Editor

- [x] 5.1 Update `components/Editor.tsx` to edit the enriched content fields (hero headline/subhead, about title/body, CTA) in Spanish labels
- [x] 5.2 Add a WhatsApp group to the editor: enable toggle, country code, number, message — prefilled from defaults

## 6. Verification

- [x] 6.1 Run typecheck, lint, and build; fix any type fallout from the `SiteContent` shape change (page, editor, deploy, render)
- [x] 6.2 In the browser, import Cheester and verify: Spanish UI, badges from real attributes, embedded map, working WhatsApp link, open-now state, and CTAs
- [x] 6.3 Verify the deployed-HTML path: `lang="es"`, Spanish title/meta, and a populated JSON-LD `Restaurant` block (inspect `renderSiteHtml` output)
- [x] 6.4 Verify graceful degradation on a business missing optional fields (no map, no badges, no WhatsApp — no broken layout)
