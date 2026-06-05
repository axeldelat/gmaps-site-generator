## MODIFIED Requirements

### Requirement: Fetch business data from Google Places API
The system SHALL fetch business data for a resolved place using the Google Places API, retrieving name, photos, opening hours, formatted address, phone number, and reviews where available, AND additionally retrieving the richer attributes Google exposes where available: an editorial summary, international phone number, geographic coordinates, place categories/types, business status, current "open now" state, the Google Maps URL, service options (dine-in, takeout, delivery, curbside pickup, reservable), meal/dietary attributes (serves breakfast/brunch/lunch/dinner/beer/wine/vegetarian food), and wheelchair accessibility.

#### Scenario: Place with complete data
- **WHEN** a resolved place has all supported fields available
- **THEN** the system returns a normalized business record containing name, photos, hours, address, phone, reviews, and the richer attributes (editorial summary, international phone, location, categories, status, open-now, service options, meal/dietary attributes, and accessibility)

#### Scenario: Place with missing optional fields
- **WHEN** a resolved place is missing one or more optional fields (e.g., no phone, no reviews, no editorial summary, no service options)
- **THEN** the system returns the normalized record with the missing fields omitted, without failing the import

## ADDED Requirements

### Requirement: Expose rich business attributes on the normalized model
The system SHALL expose the additional retrieved attributes as optional, client-safe fields on the normalized business model, so downstream site generation can use them. Every such field SHALL be optional, and its absence SHALL NOT break import or normalization.

#### Scenario: Service and dietary attributes available
- **WHEN** a place provides service options (such as delivery or takeout) and meal/dietary attributes (such as serves vegetarian food)
- **THEN** the normalized record exposes those attributes as structured boolean flags

#### Scenario: Contact and location attributes available
- **WHEN** a place provides an international phone number and geographic coordinates
- **THEN** the normalized record exposes the international phone and a location with latitude and longitude

#### Scenario: Editorial summary available
- **WHEN** a place provides an editorial summary
- **THEN** the normalized record exposes that summary text

#### Scenario: Attributes absent
- **WHEN** a place provides none of the additional attributes
- **THEN** the normalized record omits them and the import still succeeds with the previously supported fields
