# site-generation Specification

## Purpose
TBD - created by archiving change local-business-site-generator. Update Purpose after archive.
## Requirements
### Requirement: Generate a preview site from business data
The system SHALL render a preview website by populating a pre-built, responsive Next.js template with the normalized business data.

#### Scenario: Preview generated from imported data
- **WHEN** business data has been successfully imported
- **THEN** the system produces a preview site displaying the business name, photos, hours, address, phone, and reviews using the template layout

#### Scenario: Preview with partial data
- **WHEN** the imported business data is missing optional fields
- **THEN** the template omits or gracefully hides the corresponding sections without broken layout

### Requirement: Responsive, professional template
The site template SHALL render correctly and legibly across desktop and mobile viewport sizes.

#### Scenario: Mobile viewport
- **WHEN** the preview is viewed on a mobile-width viewport
- **THEN** the layout adapts responsively with readable text and appropriately sized images

### Requirement: Display top reviews
The site SHALL display at most the 5 highest-rated reviews from the imported business data, ordered from highest to lowest rating.

#### Scenario: More than five reviews available
- **WHEN** the imported business data contains more than five reviews
- **THEN** the site shows only the 5 highest-rated reviews, ordered highest rating first

#### Scenario: Five or fewer reviews available
- **WHEN** the imported business data contains five or fewer reviews
- **THEN** the site shows all available reviews, ordered highest rating first

#### Scenario: No reviews available
- **WHEN** the imported business data contains no reviews
- **THEN** the site omits the reviews section without breaking the layout

### Requirement: Preview reflects current edits
The preview SHALL reflect the latest applied text and color edits made through the editor.

#### Scenario: Edits applied to preview
- **WHEN** a user changes editable text or theme colors
- **THEN** the preview updates to show those changes

### Requirement: Cohesive visual design system
The generated site SHALL use a cohesive design system — a defined typographic scale, a consistent spacing scale, and a derived color palette built from the configured theme colors — so the result looks intentionally designed rather than templated.

#### Scenario: Consistent type and spacing scale
- **WHEN** the site is rendered
- **THEN** headings, body text, and spacing follow the defined scales (no ad-hoc font sizes or arbitrary gaps), producing clear visual hierarchy

#### Scenario: Theme colors propagate through the palette
- **WHEN** the user sets primary and accent theme colors
- **THEN** the site derives related shades (surfaces, borders, text-on-color) from those colors so the whole page stays color-cohesive

### Requirement: Accessible visual contrast
Text in the generated site SHALL meet WCAG AA contrast against its background (≥4.5:1 for body text, ≥3:1 for large text), including text placed over themed colors.

#### Scenario: Body text over a tinted or themed background
- **WHEN** text is rendered over a colored or tinted surface
- **THEN** its color provides at least the AA-required contrast ratio for its size

### Requirement: Tasteful, accessible motion
The generated site MAY use restrained motion (entrance and hover/interaction transitions), and SHALL disable or reduce non-essential motion when the visitor prefers reduced motion.

#### Scenario: Visitor prefers reduced motion
- **WHEN** the visitor's environment requests reduced motion (`prefers-reduced-motion: reduce`)
- **THEN** non-essential animations are disabled or reduced and content remains fully usable

#### Scenario: Motion does not block content
- **WHEN** the site loads
- **THEN** all content is present and readable regardless of animation state (no content hidden behind un-played animations)

### Requirement: Preview and deployed output are visually identical
The in-app preview and the deployed static site SHALL render from the same template and design tokens, so the published result matches what the user approved in the preview.

#### Scenario: Redesigned template renders identically in both paths
- **WHEN** a site is previewed in the app and then deployed
- **THEN** the deployed page uses the same layout, type scale, spacing, colors, and styles as the preview (no preview-only or deploy-only divergence)

