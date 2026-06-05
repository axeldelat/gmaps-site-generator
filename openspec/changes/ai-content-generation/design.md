## Context

All inputs now exist: `BrandVoice` (intake), rich `Business` data incl. `editorialSummary` + reviews (rich-business-data), and a template with slots and Spanish defaults (localized-rich-template). The app holds `SiteConfig` in client state; the deploy renders from it. This change adds an AI layer that fills the copy. OpenRouter is the provider (key already in `.env.local`); it exposes an OpenAI-compatible `POST /v1/chat/completions` with `response_format` for structured output.

## Goals / Non-Goals

**Goals:**
- One server-side OpenRouter call → validated, Spanish, brand-voiced `SiteContent`.
- Grounded strictly in real data; never invents facts.
- Resilient: any failure falls back to the non-AI defaults already in the config.
- Model configurable via env; key never leaves the server.

**Non-Goals:**
- Per-section regeneration / "another version" (deferred).
- English output (Spanish only now).
- Streaming UI (a single loading state is enough).

## Decisions

**1. Trigger after intake, with the existing config as fallback.**
On intake confirm, `app/page.tsx` calls `POST /api/generate-copy` with the current `SiteConfig`, shows "Generando tu página…", then merges the returned `SiteContent` and enters the studio. On any error/timeout it proceeds with the config untouched (localized-rich-template already filled Spanish defaults). Rationale: the AI strictly *upgrades* copy; it is never a hard dependency. Alternative considered: a manual "Generar con IA" button — deferred; auto-after-intake matches the agreed pipeline and the non-AI fallback keeps it safe.

**2. Structured output via JSON schema, validated server-side.**
Request `response_format: { type: "json_schema", json_schema: {…, strict: true} }` for: `heroHeadline`, `heroSubhead`, `aboutTitle`, `aboutBody`, `ctaTitle`, `ctaText`, `metaDescription`, `specialties: [{title, description}]` (max ~4), `whyUs: [string]` (max 3). The route validates the parsed JSON (types, array bounds, non-empty strings) and only applies fields that pass; malformed → fall back. Rationale: deterministic shape, no brittle prose parsing. If a model ignores `response_format`, validation still catches it.

**3. Prompt = system rules + structured facts; facts only.**
System message encodes the role ("experto en copywriting y SEO local para restaurantes en LATAM"), the **golden rule** (da voz, no inventes hechos; nada de años/premios/platillos no evidenciados; si hay pocos datos, sé conservador), Spanish-only, and the brand voice mapped to plain guidance (tone/vibe/customerFocus → register). User message provides the facts as structured data: name, humanized category, locality, price level, editorial summary, up to ~6 review snippets (text + rating), service/dietary attributes. Reviews are the grounding source for specialties. Rationale: separating immutable rules (system) from per-business facts (user) keeps behavior stable and makes the grounding explicit.

**4. `specialties` and `whyUs` are new `SiteContent` fields; template renders them when present.**
Add `specialties: {title:string; description:string}[]` and `whyUs: string[]` (defaults `[]`), plus optional `metaDescription`. The template gains an "Especialidades" section (cards) and a "Por qué elegirnos" section (list), each rendered only when non-empty. Rationale: keeps non-AI render working (empty → hidden) and lets the editor expose them.

**5. Server route owns secrets, timeout, and errors.**
`/api/generate-copy` (Node runtime) reads `OPENROUTER_API_KEY` + `OPENROUTER_MODEL` (default e.g. a strong, affordable Spanish-capable model), sets a request timeout (~30s), and returns either `{ content }` or a structured error. The client treats any non-200 as "use fallback". Rationale: mirrors the existing `lib/google` / `/api/*` server-only secret pattern.

**6. Merge, don't replace, the config.**
The route returns only the `content` fields; the client merges them over `config.content`, preserving `business`, `theme`, `brandVoice`, `whatsapp`. Rationale: AI owns copy, not structure/config.

## Risks / Trade-offs

- **Model ignores structured output / returns prose** → `response_format` + strict server validation; malformed output is discarded and defaults stand. The owner can always edit.
- **Hallucinated facts slip through** → Prompt forbids invention and is grounded in provided facts; reviews/editorial summary anchor specifics. Residual risk is mitigated because every field is editable, and we prefer conservative output on thin data. (A future change could add a verification pass.)
- **Latency adds a wait after intake** → Single call + a clear "Generando tu página…" state; ~30s timeout then fallback so the owner is never stuck.
- **Cost per generation** → One call per site; model is configurable to trade quality vs. price. No regeneration loop (deferred) keeps spend bounded.
- **Editorial summary / reviews may be sparse** → Spec requires conservative output; specialties/whyUs may come back short or empty, which the template handles by hiding.

## Open Questions

- Default `OPENROUTER_MODEL` (quality vs. cost) — to confirm before implementing; configurable regardless.
- Exact caps (how many specialties / review snippets) — start with ~4 specialties and ~6 review snippets; tune after seeing real output.
