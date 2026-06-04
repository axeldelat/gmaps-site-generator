## 1. Diagnosis (impeccable)

- [x] 1.1 Run `/impeccable audit` on `SiteTemplate.tsx` + `templateStyles.ts`; capture the baseline issue list (contrast, hierarchy, type scale, spacing, motion) — baseline 10/20
- [x] 1.2 Decide redesign boldness (refined-safe vs. distinctive) with the user, and font strategy (system stack vs. web font) — distinctive + web font (Bricolage Grotesque / Hanken Grotesk)

## 2. Design tokens (templateStyles.ts)

- [x] 2.1 Add a type scale (display → body → caption) and a spacing scale as CSS custom properties
- [x] 2.2 Derive a cohesive palette (surface, border, muted, text-on-primary/accent) from `--primary` / `--accent` using `color-mix()`, with legible fallbacks
- [x] 2.3 Add radii and elevation tokens; refactor existing rules to consume tokens (no ad-hoc sizes)

## 3. Redesign layout (design-taste-frontend leads)

- [x] 3.1 Redesign the hero (type scale, rating treatment, themed background) for strong first impression
- [x] 3.2 Redesign the gallery (grid rhythm, aspect ratios, spacing)
- [x] 3.3 Redesign the "Visit Us" info + contact cards (hierarchy, alignment)
- [x] 3.4 Redesign the reviews section (cards, stars, attribution) — keep top-5 highest-first
- [x] 3.5 Redesign the footer and verify partial-data sections still degrade gracefully

## 4. Polish & motion (emil-design-eng)

- [x] 4.1 Add restrained entrance/hover transitions (transform/opacity), gated behind `prefers-reduced-motion: no-preference`
- [x] 4.2 Tune easing, timing, and micro-details; ensure content is visible without animation

## 5. Accessibility & parity

- [x] 5.1 Verify AA contrast across all text, including text over themed colors
- [x] 5.2 Verify responsive behavior on mobile and desktop widths

## 6. Verification (impeccable critique + live)

- [x] 6.1 Run `/impeccable critique` on the redesigned template; address findings — 34/40 Good, detector clean, no P0/P1 (remaining P2/P3 are out-of-scope follow-ups: optimize, harden)
- [x] 6.2 Preview with real data (Cheester) and with synthetic partial data (no reviews/photos/hours) — confirm graceful degradation and top-5 ordering
- [x] 6.3 Re-deploy to Vercel and confirm the public site matches the preview (preview==deploy parity)
