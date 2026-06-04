## Why

The v1 generated site is functional but visually generic — it reads as "templated". For non-technical business owners, design quality is the differentiator that makes them trust and publish the site. We want the generated site to look like it was crafted by a designer, while keeping every existing behavioral guarantee intact.

## What Changes

- Redesign the visual design of the generated `SiteTemplate` (hero, gallery, "visit us", reviews, footer): a deliberate typographic scale, a consistent spacing system, refined color usage, and stronger visual hierarchy.
- Introduce a small design-token layer in the template styles (type scale, spacing, radii, derived colors) so the look is cohesive and theme colors propagate predictably.
- Add tasteful, restrained micro-interactions / motion (e.g. entrance and hover transitions) that respect `prefers-reduced-motion`.
- Preserve all existing behavior: renders from the same `SiteConfig`, preview output equals deployed output, missing optional fields degrade gracefully, and top-5 reviews show highest-rated first.
- **Out of scope:** the app studio/editor UI, the data model, and the import/deploy pipelines (a separate effort would polish the studio UI).

## Capabilities

### New Capabilities
<!-- None — this enhances an existing capability. -->

### Modified Capabilities
- `site-generation`: Strengthens the template's design-quality requirements (cohesive visual design system, accessible contrast, tasteful motion) and makes preview/deploy visual parity an explicit requirement, without changing the data inputs or the existing partial-data and top-5-reviews behavior.

## Impact

- Code: `components/SiteTemplate.tsx` (markup/structure), `components/templateStyles.ts` (design tokens + styles). No changes to the `SiteConfig` model, `lib/render`, or the API routes.
- Rendering: both the in-app preview and the deployed static HTML pick up the redesign automatically (shared component) — parity must be re-verified.
- Risk surface: purely presentational; no new dependencies, no secrets, no API changes.
