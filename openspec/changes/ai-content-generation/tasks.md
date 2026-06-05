## 1. Data model

- [x] 1.1 Add `specialties: { title: string; description: string }[]`, `whyUs: string[]`, and optional `metaDescription?` to `SiteContent` in `lib/types.ts`
- [x] 1.2 Initialize the new fields (empty arrays) in `buildDefaultSiteConfig` so non-AI render still works

## 2. AI layer (`lib/ai/`)

- [x] 2.1 `lib/ai/prompt.ts`: build the system rules (role, golden anti-hallucination rule, Spanish-only, brand-voice→register mapping) and the user facts payload (name, category, locality, price, editorial summary, ~6 review snippets, attributes); export the JSON schema for structured output
- [x] 2.2 `lib/ai/openrouter.ts`: server-only client calling OpenRouter chat/completions with `response_format` json_schema, `OPENROUTER_API_KEY` + `OPENROUTER_MODEL` (sensible default), and a ~30s timeout
- [x] 2.3 Add a validator that checks the parsed output against the expected shape (types, array caps, non-empty strings) and returns only valid fields

## 3. Server route

- [x] 3.1 `app/api/generate-copy/route.ts` (Node runtime): accept `SiteConfig`, build prompt, call OpenRouter, validate, return `{ content }` or a structured error; never expose the key

## 4. Flow integration

- [x] 4.1 In `app/page.tsx`, after intake confirm, call `/api/generate-copy` with a "Generando tu página…" loading state
- [x] 4.2 On success, merge returned content over `config.content` and enter the studio; on any error, proceed with existing defaults (resilient fallback)

## 5. Render & edit the new sections

- [x] 5.1 Render "Especialidades" (cards) and "Por qué elegirnos" (list) in `components/SiteTemplate.tsx`, shown only when non-empty; add styles in `components/templateStyles.ts`
- [x] 5.2 Prefer `content.metaDescription` for the meta tag in `lib/render/renderHtml.tsx` when present
- [x] 5.3 Add editing of specialties (title/description) and why-us points in `components/Editor.tsx`

## 6. Verification

- [x] 6.1 Run typecheck, lint, and build
- [x] 6.2 With a real key, generate copy for Cheester and verify: Spanish output, brand-voice reflected, specialties grounded in reviews, no invented facts, valid structure applied
- [x] 6.3 Verify fallback: simulate a provider failure (e.g. bad model/key) and confirm the app proceeds with non-AI defaults, no blocking error
- [x] 6.4 In the browser, run the full flow (import → intake → "Generando…" → studio) and confirm the generated copy renders and is editable
