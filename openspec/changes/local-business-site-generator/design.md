## Context

This is a greenfield Next.js (App Router) + TypeScript application. The product flow is linear: paste URL → fetch data → preview → edit → deploy. The target user is non-technical, so the UI must hide all API/infrastructure detail. Two external services are central: the Google Places API (data + photos) and the Vercel Deploy API (hosting). Both require secret credentials that must remain server-side. There is no existing code or specs to integrate with.

## Goals / Non-Goals

**Goals:**
- Turn a Google Maps URL into a live, deployed business website in a few minutes.
- Keep all secrets (Google API key, Vercel token) server-side; the browser never sees them.
- Provide a single normalized business data model that decouples the rest of the app from Google's response shape.
- Make the editor approachable: a small, fixed set of text fields and a couple of color controls.
- One-click deploy with clear progress and a returned live URL.

**Non-Goals:**
- User accounts, authentication, billing, or multi-tenant dashboards (out of scope for first version).
- Multiple template choices — a single pre-built template ships first.
- Arbitrary layout/structural editing or a full CMS.
- Custom domains and DNS management (use the default Vercel-assigned URL).
- Periodic re-syncing of Google data after generation.

## Decisions

- **Next.js App Router + Route Handlers for the backend.** Google Places and Vercel calls run in server-side Route Handlers (`app/api/*`), keeping keys off the client. Alternative — a separate backend service — rejected as over-engineering for this scope.
- **Single normalized `Business` model.** Route handlers map the raw Places response into a stable internal type that the template and editor consume. This isolates the one place that must change if Google's API changes. Alternative — passing raw API JSON around — rejected as brittle.
- **URL resolution via Places API.** Accept full and shortened (`maps.app.goo.gl`) Maps URLs; follow redirects server-side to extract the place reference, then resolve to a Place ID and call Place Details. Alternative — scraping the Maps page — rejected as fragile and against ToS.
- **Config-driven template, not codegen.** A single `SiteTemplate` React component is the template; "generation" means producing a `SiteConfig` (business data + edits), not emitting bespoke source per user. Preview and deploy share this one component. _Implementation refinement (v1):_ at deploy time the same component is rendered to **static HTML** (`renderToStaticMarkup`) and shipped as static files, rather than deploying a Next.js project that builds on Vercel — this keeps one rendering path while avoiding a remote build. `site.config.json` is still shipped alongside for transparency and future re-editing. Alternative — generating unique source files per site — rejected as harder to preview and maintain.
- **Preview = the real template rendered in-app.** The editor renders the same template component with the in-progress config so the preview is faithful to the deployed result.
- **Deploy via Vercel REST Deployments API (static, SHA-addressed upload).** The server bundles the rendered `index.html`, the fetched photo bytes (`photos/N.<ext>`), and `site.config.json`; uploads each file by its SHA1 digest to `/v2/files`; creates a deployment via `/v13/deployments` with `framework: null` (static); then polls `readyState` until READY and returns the URL. This resolved the open question on deploy mechanism. Alternative — Vercel Deploy Hooks / Git integration — rejected because it would require a per-user Git repo.
- **Photos handling.** Resolve Google photo references to displayable image URLs (proxied or fetched server-side) so the deployed site does not embed the API key in image requests.
- **Edit persistence: client state only (v1).** User edits live in client state between preview and deploy; the deploy request carries the full `site.config.json` to the server. No server-side persistence in v1. Alternative — a short-lived server store/session — deferred to v2 (e.g., to support resuming and accounts).
- **Reviews: top 5, highest-rated first (v1).** The template renders the 5 highest-rated reviews. Alternative — a live-updating widget that refreshes periodically — deferred to a future version.

## Risks / Trade-offs

- **Google Places API cost/quota** → Cache resolved place data per request session; avoid redundant detail calls; surface friendly "try again later" on quota errors.
- **Places API ToS / photo usage limits** → Use official photo endpoints and respect attribution requirements rendered in the template.
- **Vercel deploy latency / failure** → Show explicit in-progress state with polling; allow retry; log server-side details without exposing them.
- **Shortened/edge-case Maps URLs fail to resolve** → Validate early and return a clear "couldn't read that link" message; support the common URL shapes first.
- **Secret leakage** → All third-party calls in server route handlers only; never inject keys into client bundles or image `src` that reach the browser.
- **Single template limits differentiation** → Acceptable for v1; color/text editing provides minimal personalization. Multiple templates are a future extension.

## Migration Plan

Greenfield — no migration. Deployment is the standard Next.js app deploy; rollback is reverting to the prior app version. Required environment variables: `GOOGLE_PLACES_API_KEY`, `VERCEL_API_TOKEN` (and optionally `VERCEL_TEAM_ID`).

## Open Questions

All open questions are resolved as of implementation:

- _Edit persistence_ — client state only for v1; server-side persistence is a v2 feature. (Decisions)
- _Review display_ — top 5, highest-rated first for v1; live-updating widget deferred. (Decisions)
- _Vercel deployment mechanism_ — static, SHA-addressed file upload via `/v2/files` + `/v13/deployments` (`framework: null`). (Decisions)
- _v1 editable-field set_ — business name, headline, description (text) plus primary and accent colors.
