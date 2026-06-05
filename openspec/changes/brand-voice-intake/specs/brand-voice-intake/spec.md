## ADDED Requirements

### Requirement: Capture brand voice through a short intake
The system SHALL present the business owner with a brand-voice intake consisting of exactly three multiple-choice questions — tone, vibe, and customer focus — after business import and before the site editor. The intake SHALL NOT include any free-text/open input fields.

#### Scenario: Intake shown after import
- **WHEN** a business has been successfully imported and no brand voice has been captured yet
- **THEN** the brand-voice intake is shown before the editor/preview studio

#### Scenario: Each question offers preset options only
- **WHEN** the owner views any of the three questions
- **THEN** the answer is chosen from preset, tappable options and there is no free-text input

#### Scenario: Three dimensions captured
- **WHEN** the owner completes the intake
- **THEN** a tone value, a vibe value, and a customer-focus value are recorded

### Requirement: Smart defaults pre-selected from business data
The system SHALL pre-select a suggested answer for each intake question derived from the imported Google business data (such as rating and price level), so that the owner can confirm the intake with minimal input.

#### Scenario: Defaults pre-selected on first view
- **WHEN** the intake is shown for the first time for an imported business
- **THEN** each question already has a suggested option pre-selected

#### Scenario: Owner confirms without changing anything
- **WHEN** the owner accepts the pre-selected suggestions without changing them
- **THEN** the intake completes using the suggested values

#### Scenario: Default derived from available business signals
- **WHEN** the imported business includes signals such as rating or price level
- **THEN** the pre-selected suggestions reflect those signals, and when such signals are absent a neutral default is used

### Requirement: Persist brand voice on the site configuration
The system SHALL persist the captured brand voice as structured data on the site configuration so it is available to downstream copy generation and is carried with the configuration through editing and deployment.

#### Scenario: Brand voice stored on completion
- **WHEN** the owner completes the intake
- **THEN** the selected tone, vibe, and customer-focus values are stored on the site configuration as structured brand-voice data

#### Scenario: Brand voice available downstream
- **WHEN** the site configuration is read after the intake completes
- **THEN** the structured brand-voice data is present and can be consumed by later steps

### Requirement: LATAM Spanish intake interface
The system SHALL present the brand-voice intake questions and options in LATAM Spanish.

#### Scenario: Questions and options in Spanish
- **WHEN** the owner views the intake
- **THEN** the questions and their options are presented in LATAM Spanish
