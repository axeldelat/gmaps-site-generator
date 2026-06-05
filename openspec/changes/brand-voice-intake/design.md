## Context

The app flow today is: import (`UrlImportForm`) → `buildDefaultSiteConfig(business)` → studio (`Editor` + `Preview` + `DeployPanel`), with `SiteConfig` as the single client-side source of truth (`app/page.tsx`). Copy is generic and templated.

This change inserts a brand-voice intake between import and studio, and adds a `BrandVoice` to `SiteConfig`. It is intentionally LLM-free: it is change A of three (A intake → B `ai-content-generation` → C richer template + editor). The downstream consumer of `BrandVoice` is change B, so the model must be stable and self-contained now, even though nothing renders it yet.

Constraints: Next.js 15 App Router, React 19, TypeScript; v1 has no persistence (client state only); the audience is busy, non-technical LATAM restaurant owners, so the intake must be near-zero friction.

## Goals / Non-Goals

**Goals:**
- Capture three brand dimensions (tone, vibe, customer focus) with a one-tap-to-confirm experience.
- Pre-select smart defaults from existing Google signals (`rating`, `price_level`) so the common path is pure confirmation.
- Persist a structured, typed `BrandVoice` on `SiteConfig` that change B can consume unchanged.
- Keep the model a closed set of enum-like literals (not free text) so prompts in change B are deterministic.

**Non-Goals:**
- No LLM / copy generation (change B).
- No template or editor changes that render brand voice (change C).
- No usted/tú/vos formality dimension (deferred).
- No server-side persistence (out of scope for v1 overall).

## Decisions

**1. `BrandVoice` as a closed set of string-literal unions, stored on `SiteConfig`.**
Add `tone`, `vibe`, and `customerFocus` as union types in `lib/types.ts` and a `brandVoice: BrandVoice` field on `SiteConfig`. Rationale: closed enums keep change B's prompt mapping deterministic and make the UI a simple option list. Alternative considered: free-text personality description — rejected, it breaks the "no open fields / busy owner" requirement and makes prompts unpredictable.

**2. Intake as a gate between import and studio, driven by a `brandVoice == null` check.**
`buildDefaultSiteConfig` computes and attaches a *suggested* `BrandVoice` (the smart default) immediately on import, but the studio only renders once the owner has confirmed the intake. Track confirmation with a small piece of state (e.g. an `intakeConfirmed` flag in `app/page.tsx`, or a nullable `brandVoice` that starts unset). Rationale: keeps `SiteConfig` the single source of truth while still gating the UI. Alternative considered: a separate route/page for the intake — rejected as heavier than needed for client-only v1.

**3. Smart default derived by a pure function from `Business`.**
A `suggestBrandVoice(business): BrandVoice` helper maps signals to suggestions, e.g. higher `price_level` / high `rating` → `Elegante`+`Clásico`+`Calidad`; low price level → `Amigable`+`Cálido`+`Trato cálido`; missing signals → a neutral default (`Amigable`+`Cálido`+`Trato cálido`). Rationale: pure and testable, no side effects. The exact mapping is a heuristic and can be tuned without API changes.

**4. Surface Google `price_level` additively on `Business`.**
Add an optional `priceLevel?: number` (0–4, Google's scale) to the `Business` model and populate it in normalization. Rationale: it is the strongest available signal for the "level" of a place (changarro vs. carnes finas). Additive and optional, so it does not change `business-data-import` requirements. If unavailable, the suggester falls back to rating-only / neutral.

**5. Option-card UI component `BrandVoiceIntake`.**
Large tappable cards (icon + short label), one question at a time or stacked, with the suggested option visibly pre-selected and a single primary "Continuar" / "Generar mi página" action. Rationale: matches the agreed "botonzotes" UX and minimizes reading for a busy owner.

## Risks / Trade-offs

- **Smart-default heuristic feels wrong for some businesses** → The owner can always change any pre-selected option in one tap; the default only optimizes the common path, it never locks anything.
- **`price_level` is frequently missing from Places data** → The suggester degrades gracefully to rating-only and then to a neutral default; the intake never depends on `price_level` being present.
- **`BrandVoice` shape churns when change B starts** → Mitigated by modeling it now as closed unions covering exactly the three agreed dimensions and their agreed options; change B consumes, it does not need to reshape.
- **Adding a step adds friction to a previously two-screen flow** → Mitigated by pre-selection (one-tap confirm) and keeping it to three questions with no typing.

## Migration Plan

Purely additive and client-side. `BrandVoice` rides along in `SiteConfig` but is not yet rendered or deployed-against, so there is no data migration and no rollback concern. Reverting the change simply removes the intake gate and the `brandVoice` field.

## Open Questions

- Final tuning of the `suggestBrandVoice` heuristic thresholds (which rating/price_level bands map to which suggestions) — can be refined during implementation without spec changes.
- Single-screen (all three questions stacked) vs. one-question-per-step — a UX detail to settle in implementation; both satisfy the spec.
