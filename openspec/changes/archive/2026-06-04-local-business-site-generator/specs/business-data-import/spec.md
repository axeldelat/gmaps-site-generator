## ADDED Requirements

### Requirement: Accept and validate a Google Maps URL
The system SHALL accept a Google Maps URL as input and validate that it references a Google business/place before attempting any data fetch.

#### Scenario: Valid place URL submitted
- **WHEN** a user submits a Google Maps URL that references a place (including shortened `maps.app.goo.gl` links)
- **THEN** the system resolves it to a Google Place ID and proceeds to fetch business data

#### Scenario: Invalid or non-place URL submitted
- **WHEN** a user submits a URL that is not a valid Google Maps place link
- **THEN** the system rejects the input and returns a clear, non-technical error message explaining a valid business URL is required

### Requirement: Fetch business data from Google Places API
The system SHALL fetch business data for a resolved place using the Google Places API, retrieving name, photos, opening hours, formatted address, phone number, and reviews where available.

#### Scenario: Place with complete data
- **WHEN** a resolved place has all supported fields available
- **THEN** the system returns a normalized business record containing name, photos, hours, address, phone, and reviews

#### Scenario: Place with missing optional fields
- **WHEN** a resolved place is missing one or more optional fields (e.g., no phone or no reviews)
- **THEN** the system returns the normalized record with the missing fields omitted or empty, without failing the import

### Requirement: Normalize business data into a stable shape
The system SHALL transform the Google Places API response into a stable internal business data model that downstream site generation depends on, independent of the raw API response format.

#### Scenario: API response normalized
- **WHEN** the Google Places API returns a place response
- **THEN** the system maps it to the internal business model with consistent field names and types

### Requirement: Handle API failures gracefully
The system SHALL handle Google Places API errors (quota exceeded, not found, network failure) without exposing raw API errors to the user.

#### Scenario: Quota or rate limit error
- **WHEN** the Google Places API returns a quota or rate-limit error
- **THEN** the system returns a user-friendly message asking the user to try again later, and logs the underlying error server-side

#### Scenario: Place not found
- **WHEN** the Google Places API cannot find the requested place
- **THEN** the system informs the user the business could not be found and prompts them to re-check the URL
