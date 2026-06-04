## Why

Non-technical local business owners (restaurants, salons, contractors, shops) often lack a professional website despite already having a rich Google Business presence. Building one from scratch is slow and intimidating. This tool lets an owner paste their Google Maps URL and get a live, deployed website in minutes by reusing the data Google already has about their business.

## What Changes

- New web app where a user pastes a Google Maps URL for their business.
- Resolve the URL to a Google Place and fetch business data via the Google Places API: name, photos, opening hours, address, phone, and reviews.
- Generate a preview website by populating a pre-built, responsive Next.js template with the fetched data.
- Allow basic, non-technical editing of the preview: text content (headline, description, section copy) and theme colors.
- One-click deploy of the finished site to Vercel, returning a live URL to the owner.

## Capabilities

### New Capabilities
- `business-data-import`: Accept a Google Maps URL, resolve it to a place, and fetch normalized business data (name, photos, hours, address, phone, reviews) from the Google Places API.
- `site-generation`: Render a preview website from a pre-built Next.js template populated with imported business data.
- `site-editor`: Let non-technical users edit site text and theme colors and see the changes reflected in the preview.
- `vercel-deployment`: Deploy the generated site to Vercel with one click and return the live URL to the user.

### Modified Capabilities
<!-- None — this is a greenfield project with no existing specs. -->

## Impact

- New greenfield codebase: Next.js (App Router) + TypeScript.
- External dependencies: Google Places API (data + photos), Vercel Deploy API.
- API keys / secrets: Google Places API key, Vercel API token (server-side only).
- Cost and quota considerations from Google Places API usage and stored photos.
- A pre-built Next.js site template is introduced as a deployable artifact.
