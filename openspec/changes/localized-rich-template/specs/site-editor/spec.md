## MODIFIED Requirements

### Requirement: Edit site text content
The system SHALL allow a non-technical user to edit the site's text content — including the hero headline and subhead, the "about" title and body, the final call-to-action, and the business name — without editing code.

#### Scenario: User edits headline text
- **WHEN** a user changes an editable text field in the editor
- **THEN** the new text is saved to the site configuration and shown in the preview

#### Scenario: Pre-filled defaults from business data
- **WHEN** the editor first loads after import
- **THEN** editable text fields are pre-filled with sensible Spanish defaults derived from the imported business data (e.g. the "about" body seeded from the editorial summary)

## ADDED Requirements

### Requirement: Edit WhatsApp configuration
The system SHALL allow the user to configure the floating WhatsApp button: enable or disable it, and edit the country code, phone number, and prefilled message. The number SHALL be pre-filled from the business's international phone when available.

#### Scenario: Prefilled from business phone
- **WHEN** the editor loads and the business has an international phone number
- **THEN** the WhatsApp number and country code are pre-filled from it

#### Scenario: User edits the message and toggles the button
- **WHEN** the user changes the WhatsApp message or toggles the button off
- **THEN** the configuration is saved and the preview reflects the change (updated link, or no button when disabled)
