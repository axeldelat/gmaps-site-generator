## 1. Project Setup

- [x] 1.1 Scaffold Next.js (App Router) + TypeScript project with linting/formatting
- [x] 1.2 Add environment variable config and `.env.example` for `GOOGLE_PLACES_API_KEY`, `VERCEL_API_TOKEN`, optional `VERCEL_TEAM_ID`
- [x] 1.3 Define the normalized `Business` TypeScript model (name, photos, hours, address, phone, reviews) and `SiteConfig` (business data + edits)

## 2. Business Data Import (business-data-import)

- [x] 2.1 Implement URL validation + resolution (full and `maps.app.goo.gl` short links) to a Google Place ID, server-side
- [x] 2.2 Implement Google Place Details fetch and map the response into the normalized `Business` model
- [x] 2.3 Resolve Google photo references to displayable image URLs without exposing the API key to the client
- [x] 2.4 Handle errors (invalid URL, not found, quota/rate limit, network) with user-friendly messages and server-side logging
- [x] 2.5 Add a Route Handler `POST /api/import` returning the normalized business record
- [x] 2.6 Build the input UI (paste URL, submit, loading + error states)

## 3. Site Generation (site-generation)

- [x] 3.1 Build the pre-built responsive Next.js site template that renders from `SiteConfig`
- [x] 3.2 Implement graceful handling of missing optional fields (hide sections without breaking layout)
- [x] 3.3 Verify responsive rendering across desktop and mobile viewports
- [x] 3.4 Render the template as an in-app preview driven by the in-progress `SiteConfig`

## 4. Site Editor (site-editor)

- [x] 4.1 Pre-fill editable text fields with defaults derived from imported business data
- [x] 4.2 Implement text editing controls bound to `SiteConfig`
- [x] 4.3 Implement theme color controls (primary/accent) applied to the template
- [x] 4.4 Make the preview update live as text and colors change
- [x] 4.5 Persist edits so they are available at deploy time

## 5. Vercel Deployment (vercel-deployment)

- [x] 5.1 Implement server-side bundling of template files + user `site.config.json`
- [x] 5.2 Implement `POST /api/deploy` using the Vercel Deployments API (keys server-side only)
- [x] 5.3 Poll deployment status and return the live URL when READY
- [x] 5.4 Build deploy UI: one-click trigger, in-progress status, success URL, failure + retry

## 6. Verification

- [x] 6.1 End-to-end test the flow: paste URL → import → preview → edit → deploy → open live URL  _(verified live against Cheester Playa del Carmen → public Vercel URL)_
- [x] 6.2 Verify no secrets are present in the client bundle or browser network requests
- [x] 6.3 Verify each spec scenario (import errors, partial data, responsive layout, edit persistence, deploy failure/retry) behaves as specified  _(verified live; reviews confirmed highest-first 5,5,5,3,1; deployed site public, no key leak)_
