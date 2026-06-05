## MODIFIED Requirements

### Requirement: Generate a preview site from business data
The system SHALL render a preview website by populating a pre-built, responsive Next.js template with the normalized business data, structured as: a hero (headline, subhead, rating, open-now state, and conversion CTAs), a trust-badge bar, an "about" section, a photo gallery, a reviews section, a "visit us" section with location and an embedded map, a final call-to-action, and a footer with full contact details. All visible template text SHALL be in Spanish.

#### Scenario: Preview generated from imported data
- **WHEN** business data has been successfully imported
- **THEN** the system produces a preview site displaying the business name, photos, hours, address, phone, and reviews using the localized (Spanish) template layout

#### Scenario: Preview with partial data
- **WHEN** the imported business data is missing optional fields
- **THEN** the template omits or gracefully hides the corresponding sections and badges without broken layout

## ADDED Requirements

### Requirement: Spanish localization
The generated site SHALL present all template-owned text (section titles, labels, calls-to-action, footer) in Spanish, and the document language SHALL be declared as Spanish (`lang="es"`) in both the in-app layout and the deployed HTML.

#### Scenario: Section labels in Spanish
- **WHEN** the site renders
- **THEN** template-owned labels read in Spanish (e.g. "Galería", "Visítanos", "Lo que dicen", "Horarios"), not English

#### Scenario: Document language declared
- **WHEN** the deployed HTML is produced
- **THEN** the root element declares `lang="es"`

### Requirement: Trust badges from real attributes
The generated site SHALL display a row of trust badges derived only from real business attributes (such as open-now state, price level, meal/dietary attributes, service options, and accessibility), rendering a badge only when its underlying attribute is explicitly present.

#### Scenario: Known attributes shown as badges
- **WHEN** the business has known attributes (e.g. serves vegetarian food, offers delivery, wheelchair accessible)
- **THEN** the site shows a badge for each known attribute, labeled in Spanish

#### Scenario: Unknown attributes omitted
- **WHEN** an attribute is absent/unknown for the business
- **THEN** no badge is shown for it (absence is never rendered as a negative)

### Requirement: Conversion actions
The generated site SHALL offer conversion actions based on available data: a call link when a phone number exists, a directions/map action when coordinates exist, and a floating WhatsApp button when WhatsApp is configured and enabled.

#### Scenario: Call and directions available
- **WHEN** the business has a phone number and coordinates
- **THEN** the hero presents a call action and a "cómo llegar"/directions action

#### Scenario: Floating WhatsApp button
- **WHEN** WhatsApp is enabled with a country code and number
- **THEN** a floating button links to the correct `wa.me` URL with the configured prefilled message

#### Scenario: WhatsApp disabled or unconfigured
- **WHEN** WhatsApp is disabled or has no number
- **THEN** no WhatsApp button is rendered

### Requirement: Embedded location map
The generated site SHALL embed a location map when the business has geographic coordinates, and SHALL omit the map when coordinates are absent.

#### Scenario: Coordinates present
- **WHEN** the business has latitude and longitude
- **THEN** the "visit us" section embeds a map centered on the location

#### Scenario: Coordinates absent
- **WHEN** the business has no coordinates
- **THEN** the map is omitted without breaking the section

### Requirement: About section seeded from real description
The generated site SHALL render an "about" section from the editable about content, whose default is seeded from the business's editorial summary when available.

#### Scenario: Editorial summary available
- **WHEN** the business has an editorial summary and the about content has not been edited
- **THEN** the about section displays text seeded from that summary

#### Scenario: No editorial summary
- **WHEN** the business has no editorial summary and no about content
- **THEN** the about section is omitted without breaking the layout

### Requirement: Technical local SEO output
The deployed HTML SHALL include technical local-SEO elements: a descriptive `<title>` and meta description derived from real business data, descriptive `alt` text for images, and JSON-LD `Restaurant` structured data containing the available facts (such as name, address, telephone, geo coordinates, aggregate rating, opening hours, price range, cuisine/category, and service options).

#### Scenario: Structured data emitted
- **WHEN** the deployed HTML is produced
- **THEN** it contains a JSON-LD `Restaurant` block populated with the business facts that are available

#### Scenario: Descriptive image alt text
- **WHEN** a gallery image is rendered
- **THEN** its `alt` text describes the business rather than a generic placeholder like "photo 2"

#### Scenario: Title and meta from real data
- **WHEN** the deployed HTML is produced
- **THEN** the `<title>` and meta description are built from real business data (e.g. name, category, locality)
