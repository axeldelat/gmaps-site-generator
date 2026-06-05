## 1. Data model

- [x] 1.1 Add `Tone`, `Vibe`, and `CustomerFocus` string-literal union types and a `BrandVoice` interface (`{ tone, vibe, customerFocus }`) to `lib/types.ts`
- [x] 1.2 Add `brandVoice: BrandVoice` to the `SiteConfig` interface in `lib/types.ts`
- [x] 1.3 Add optional `priceLevel?: number` (Google 0–4 scale) to the `Business` interface in `lib/types.ts`

## 2. Smart-default logic

- [x] 2.1 Populate `priceLevel` in the Places normalization (`lib/google/places.ts`), defaulting to undefined when absent
- [x] 2.2 Implement a pure `suggestBrandVoice(business): BrandVoice` helper in `lib/site-config.ts` mapping `rating`/`priceLevel` signals to suggested tone/vibe/customerFocus, with a neutral fallback when signals are missing
- [x] 2.3 Attach the suggested `BrandVoice` to the config returned by `buildDefaultSiteConfig` (so the smart default exists immediately after import)

## 3. Intake UI

- [x] 3.1 Define the three questions and their options as data (id, Spanish label, icon) for tono, vibra, and sello con el cliente
- [x] 3.2 Build a `BrandVoiceIntake` component with large tappable option cards, the suggested option visibly pre-selected per question, and a single primary action ("Continuar"/"Generar mi página")
- [x] 3.3 Ensure all questions and options render in LATAM Spanish and there are no free-text inputs

## 4. Flow integration

- [x] 4.1 In `app/page.tsx`, insert the intake as a gate between import and the studio (e.g. via an `intakeConfirmed` flag), keeping `SiteConfig` the single source of truth
- [x] 4.2 On import, build the config with the suggested `BrandVoice`; show the intake before the editor/preview
- [x] 4.3 On intake confirm, persist the (possibly adjusted) `BrandVoice` into `SiteConfig` and proceed to the studio
- [x] 4.4 Ensure "Start over" resets the intake state along with the config

## 5. Verification

- [x] 5.1 Verify the intake appears after import with defaults pre-selected, and one-tap confirm proceeds to the studio
- [x] 5.2 Verify changing any option updates the stored `BrandVoice`, and that it is present on `SiteConfig` downstream (e.g. logged/inspected)
- [x] 5.3 Verify graceful behavior when `rating` and `priceLevel` are absent (neutral default, no errors)
- [x] 5.4 Run typecheck/lint and confirm the app builds
