## ADDED Requirements

### Requirement: Render AI-generated specialties and value points
The generated site SHALL render a "specialties" section and a "why choose us" section from the generated content, each shown only when it has content and omitted otherwise.

#### Scenario: Specialties present
- **WHEN** the content has one or more specialties
- **THEN** the site renders a specialties section listing each with its title and description

#### Scenario: Value points present
- **WHEN** the content has value-proposition points
- **THEN** the site renders a "por qué elegirnos" section listing them

#### Scenario: Both empty
- **WHEN** the content has no specialties and no value points
- **THEN** neither section is rendered and the layout is not broken
