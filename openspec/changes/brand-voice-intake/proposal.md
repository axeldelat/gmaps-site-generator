## Why

Today the generated site uses fixed, generic copy (`"Welcome to {name}"`, `"Visit us at {address}…"`) that sounds the same for every business. The real value of the product is turning extracted Google data into a landing that sounds like *this specific business* — but to write copy with a real personality we first need to know the business's personality. This change captures that personality from the owner before generation. It is the first of three planned changes (A: this intake → B: AI copy generation → C: richer template + editor); it deliberately ships **without** any LLM so the intake and `BrandVoice` model can be validated on their own.

## What Changes

- Add a new **brand-voice intake step** to the app flow, between business import and the editor. The busy, non-technical owner answers **3 multiple-choice questions** (no open text fields) with large, tappable option cards:
  1. **Tono** — "¿Cómo quieres que se sienta tu página?" → Amigable y cercano / Formal y profesional / Divertido y casual / Elegante y premium
  2. **Vibra** — "¿Qué vibra tiene tu negocio?" → Con carácter / Cálido / Enérgico / Clásico
  3. **Sello con el cliente** — "¿Qué es lo más importante con tus clientes?" → Atiendo rápido / Trato cálido y personal / Calidad de ingredientes / Ambiente y experiencia
- **Smart default**: for each question a suggested answer is pre-selected based on the imported Google data (`rating`, `price_level`), so the owner mostly just confirms with one tap.
- Introduce a new **`BrandVoice` data model** persisted inside `SiteConfig`, so the next change (`ai-content-generation`) can consume it.
- UI copy in **LATAM Spanish**.
- **Out of scope (deferred):** usted/tú/vos formality dimension; any LLM/copy generation (change B); template and editor expansion (change C).

## Capabilities

### New Capabilities
- `brand-voice-intake`: Capture a business's brand personality through a short, multiple-choice intake with smart defaults, and persist it as structured `BrandVoice` data on the site configuration for downstream copy generation.

### Modified Capabilities
<!-- None. The intake is a new step; site-editor/site-generation requirements are unchanged in this change. Google price_level is additive to imported data and does not change business-data-import's existing requirements. -->

## Impact

- **New data model**: `BrandVoice` in `lib/types.ts`, added as a field on `SiteConfig`.
- **App flow** (`app/page.tsx`): new intake screen shown after import and before the editor/preview studio; new client state for the intake gate.
- **Defaults** (`lib/site-config.ts`): `buildDefaultSiteConfig` (or a new helper) computes the smart-default `BrandVoice` from `Business` data.
- **New component**: a `BrandVoiceIntake` component (option-card UI).
- **Imported data**: optionally surface Google `price_level` on the `Business` model to drive the smart default (additive, optional field).
- **No changes** to deploy, the rendered template, or the editor in this change. `BrandVoice` rides along in `SiteConfig` but is not yet rendered or used.
