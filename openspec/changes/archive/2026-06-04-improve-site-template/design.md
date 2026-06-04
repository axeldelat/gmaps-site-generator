## Context

The generated site is produced by a single shared component, `components/SiteTemplate.tsx`, styled by a CSS string in `components/templateStyles.ts` (scoped under `.site-template`, themed via `--primary` / `--accent`). The same component renders both the in-app preview (`Preview.tsx`) and the deployed static HTML (`lib/render/renderHtml.tsx` via `renderToReadableStream`). Any redesign must live in these two files and must not change the `SiteConfig` data model or the render/deploy pipeline. The work is driven by three installed design skills (impeccable, design-taste-frontend, emil-design-eng).

## Goals / Non-Goals

**Goals:**
- A generated site that reads as professionally designed: deliberate type scale, consistent spacing, refined color usage, clear hierarchy.
- A small design-token layer so the look is cohesive and theme colors propagate predictably (derived surfaces/borders/text-on-color).
- Restrained, accessible motion (`prefers-reduced-motion` aware).
- AA contrast, including text over themed colors.
- Preserve the contract: renders from `SiteConfig`, preview == deploy, graceful partial data, top-5 reviews highest-first.

**Non-Goals:**
- The app studio/editor UI (separate effort).
- Data model, import, or deploy pipeline changes.
- New runtime dependencies or a CSS framework.
- Multiple selectable templates (still future work).

## Decisions

- **Keep the two-file, string-CSS architecture.** Tokens and styles stay in `templateStyles.ts` as scoped CSS; markup stays in `SiteTemplate.tsx`. This preserves preview/deploy parity for free (both consume the same string) and avoids introducing a CSS pipeline that wouldn't survive static rendering. Alternative — CSS Modules / Tailwind — rejected because the deployed artifact is hand-rendered static HTML.
- **Introduce design tokens as CSS custom properties.** Define a type scale, spacing scale, radii, and *derived* color variables (surface, border, muted, text-on-primary) computed from `--primary` / `--accent`. Use `color-mix()` in OKLCH/sRGB to derive shades so a single theme color yields a cohesive palette. Alternative — hardcoded greys — rejected as the cause of the "templated" look.
- **Motion via CSS only, reduced-motion gated.** Entrance/hover transitions defined in CSS and wrapped in `@media (prefers-reduced-motion: no-preference)`. No JS animation libraries (would break static deploy and add weight). Content is visible by default; animation only enhances.
- **Skill-driven, OpenSpec-wrapped workflow** (the agreed flow):
  1. `impeccable /impeccable audit` on the current template → objective baseline of issues.
  2. `design-taste-frontend` drives the redesign (the generated site is a marketing/landing surface — its declared sweet spot).
  3. `emil-design-eng` applies a final polish pass (micro-interactions, easing, details).
  4. `impeccable /impeccable critique` as an adversarial closing check.
- **Verify with real and partial data.** Re-run preview with the real Cheester data and with a synthetic partial business (no reviews, no photos, no hours) to confirm graceful degradation, then re-deploy and check the public URL for parity.

## Risks / Trade-offs

- **Redesign breaks preview/deploy parity** → Mitigated structurally: both paths use the same component+CSS string; parity is re-verified as an explicit task and spec scenario.
- **`color-mix()` browser support / static-HTML rendering** → It is widely supported in modern browsers; provide sensible fallbacks for derived colors so older browsers still render legibly.
- **Skills give conflicting guidance** → One skill drives at a time (taste-skill leads; impeccable bookends; emil polishes), per the agreed flow, to avoid contradictory directives.
- **Motion hurting performance or accessibility** → CSS-only, GPU-friendly properties (transform/opacity), gated behind reduced-motion; content never depends on animation.
- **impeccable CLI (`npx impeccable`) may be required for "live" flows** → The user has opted in to running the CLI; `audit`/`critique`/`craft` work without it, and CLI use will be surfaced before running.

## Open Questions

Resolved after the audit:
- **Boldness:** distinctive/opinionated. The redesign breaks the templated look (image-led hero, characterful type, committed color) rather than only polishing. Because the template is generic, the boldness comes from structure + the owner's own photos + typography, not a business-category-specific style.
- **Typography:** a web font with character. Display = **Bricolage Grotesque**, body = **Hanken Grotesk** (both outside impeccable's reflex-reject list; paired on a contrast axis: characterful display vs. neutral body). Loaded via Google Fonts `@import` inside the template CSS string so preview and deploy stay identical.

Resolved during implementation:
- **Contrast safety with user colors:** never use the raw theme color as text on white. Headings use a dark ink; links/accents use a darkened `--primary-ink`; the hero always carries a dark scrim so white text is legible over any theme color or photo.
