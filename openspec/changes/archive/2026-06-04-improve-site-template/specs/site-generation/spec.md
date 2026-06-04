## ADDED Requirements

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
