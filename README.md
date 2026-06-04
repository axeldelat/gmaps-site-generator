# Local Business Site Generator

Turn a Google Maps link into a live, deployed business website in minutes.

A non-technical business owner pastes their Google Maps URL; the app fetches their
business data from the Google Places API, generates a preview site from a built-in
template, lets them tweak text and colors, and publishes it to a public Vercel URL
with one click.

## How it works

```
Paste Google Maps URL
      │
      ▼
/api/import ──► resolve URL → Place ID → Place Details      (Google Places API, server-side)
      │         normalize into a Business model
      ▼
Editor + live Preview ──► edit text + theme colors          (client state, SiteConfig)
      │
      ▼
/api/deploy ──► render template to static HTML              (same SiteTemplate component)
               bundle HTML + photos + site.config.json
               upload to Vercel, poll until READY           (Vercel Deployments API)
               return public live URL
```

The same `SiteTemplate` React component drives both the in-app preview and the
deployed static HTML, so what you see is what gets published.

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Google Places API** — business data and photos (server-side only)
- **Vercel Deployments API** — one-click hosting

## Getting started

Requires Node.js 20.19+.

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

### Environment variables

All secrets are used server-side only and are never exposed to the browser.

| Variable | Required | Purpose |
| --- | --- | --- |
| `GOOGLE_PLACES_API_KEY` | yes | Resolve URLs, fetch place details and photos |
| `VERCEL_API_TOKEN` | yes | Create deployments |
| `VERCEL_TEAM_ID` | no | Set if the token belongs to a Vercel team |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npm run typecheck` | Type-check without emitting |

## Project structure

```
app/
  page.tsx              # Main flow: import → editor + preview → deploy
  api/import/route.ts   # POST: Google Maps URL → normalized Business
  api/photo/route.ts    # GET: proxy a place photo (keeps API key server-side)
  api/deploy/route.ts   # POST: bundle + deploy site to Vercel
components/
  SiteTemplate.tsx      # The generated site template (preview + deploy)
  templateStyles.ts     # Template CSS (themable via --primary / --accent)
  Preview.tsx           # In-app live preview
  Editor.tsx            # Text + color controls
  DeployPanel.tsx       # One-click deploy UI
  UrlImportForm.tsx     # URL input
lib/
  types.ts              # Business / SiteConfig data model
  site-config.ts        # Defaults + top-5 reviews
  google/places.ts      # URL resolution, Place Details, photos, error handling
  render/renderHtml.tsx # Render template to static HTML for deploy
  vercel/deploy.ts      # SHA upload → create deployment → poll
openspec/               # Spec-driven change artifacts (proposal, specs, design, tasks)
```

## What's in scope (v1)

- Single built-in, responsive template; editable text (name, headline, description)
  and theme colors (primary, accent).
- Top 5 reviews shown, highest-rated first.
- Edits live in client state (server-side persistence is a planned v2 feature).
- Generated sites are published as public Vercel deployments.

## Spec-driven development

This project is built with [OpenSpec](https://github.com/Fission-AI/OpenSpec).
The full proposal, capability specs, design decisions, and task breakdown live
under `openspec/`.
