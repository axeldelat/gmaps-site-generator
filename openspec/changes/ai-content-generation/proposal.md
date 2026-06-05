## Why

This is the payoff of the whole direction: the landing finally gets copy that sounds like *this* business, written in Spanish with the owner's chosen brand voice — instead of generic defaults or Google's English editorial summary. We now have everything needed: the brand voice (`brand-voice-intake`), rich real data including the editorial summary and reviews (`rich-business-data`), and a template with slots ready to render richer copy (`localized-rich-template`). This change adds the AI layer: a single OpenRouter call that turns `Business + BrandVoice` into rich, grounded, Spanish copy for the whole site.

## What Changes

- **New server route `POST /api/generate-copy`**: takes the current `SiteConfig`, calls OpenRouter once with a structured-output request, and returns enriched `SiteContent` (Spanish copy). The API key stays server-side (`OPENROUTER_API_KEY` in env); the model is configurable (`OPENROUTER_MODEL`).
- **One request, rich copy**: the model rewrites/generates, in Spanish, with the brand voice: `heroHeadline` (local-SEO: cuisine + locality + hook), `heroSubhead`, `aboutTitle`/`aboutBody` (rewriting Google's possibly-English summary into Spanish), `ctaTitle`/`ctaText`, `metaDescription`, plus two **new** fields — `specialties` (dishes/services drawn from reviews) and `whyUs` (value-prop bullets).
- **Anti-hallucination grounding**: the prompt is built from real facts only (name, categories, locality, editorial summary, review snippets, brand voice) with explicit rules: give voice, never invent facts (no fake years/awards/dishes); when data is thin, stay conservative and only speak about what exists.
- **Triggered after the intake**: once the owner confirms the brand voice, the app calls generate-copy and shows a "Generando tu página…" state, then enters the studio with AI copy applied. **If the call fails, it falls back to the non-AI defaults** already produced by `localized-rich-template` (resilient).
- **Render + edit the new fields**: the template renders `specialties` and `whyUs` sections (hidden when empty); the editor lets the owner edit them.
- **Out of scope:** per-section regeneration / "give me another version" (deferred); English output (Spanish only for now).

## Capabilities

### New Capabilities
- `ai-content-generation`: Generate rich, Spanish, brand-voiced site copy from real business data in a single OpenRouter call, grounded against invention, with graceful fallback to non-AI defaults.

### Modified Capabilities
- `site-generation`: The template additionally renders an AI-generated "especialidades" section and a "por qué elegirnos" section, each shown only when present.
- `site-editor`: The editor additionally edits the AI-generated specialties and why-us fields.

## Impact

- **New** `lib/ai/openrouter.ts` (client) + `lib/ai/prompt.ts` (prompt + JSON schema) + `app/api/generate-copy/route.ts` (server route).
- **`lib/types.ts`**: `SiteContent` gains `specialties: { title, description }[]`, `whyUs: string[]`, and optional `metaDescription`.
- **`lib/site-config.ts`**: defaults initialize the new fields empty (so non-AI render still works).
- **`app/page.tsx`**: after intake confirm, call generate-copy with loading state; apply result or fall back to defaults on error.
- **`components/SiteTemplate.tsx`** + **`components/templateStyles.ts`**: render + style specialties and why-us sections.
- **`components/Editor.tsx`**: edit specialties and why-us.
- **`lib/render/renderHtml.tsx`**: prefer `metaDescription` for the meta tag when present.
- **Config/secrets**: `OPENROUTER_API_KEY` (already in `.env.local`), `OPENROUTER_MODEL` (new, with a sensible default).
- No changes to import or deploy mechanics.
