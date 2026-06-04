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

