## ADDED Requirements

### Requirement: Generate rich site copy from business data
The system SHALL generate enriched site copy in Spanish from the imported business data and the captured brand voice, via a single server-side AI request, producing the hero headline and subhead, the about title and body, the final call-to-action, a meta description, a set of specialties, and value-proposition points.

#### Scenario: Copy generated after intake
- **WHEN** the owner confirms the brand-voice intake
- **THEN** the system requests generated copy and, on success, applies the Spanish copy to the site configuration before showing the studio

#### Scenario: Single request
- **WHEN** copy is generated
- **THEN** all generated fields are produced from one AI request, not many

### Requirement: Brand voice shapes the copy
The generated copy SHALL reflect the brand voice (tone, vibe, customer focus) captured in the intake.

#### Scenario: Tone reflected
- **WHEN** the brand voice indicates a given tone (e.g. friendly vs. elegant)
- **THEN** the generated copy's register matches that tone

### Requirement: Spanish output
All generated copy SHALL be in LATAM Spanish, regardless of the language of the source data.

#### Scenario: Source data in another language
- **WHEN** the source editorial summary or reviews are in English
- **THEN** the generated copy is still written in Spanish

### Requirement: Grounded against invention
The generation SHALL be grounded only in real provided facts (name, categories, locality, editorial summary, reviews, attributes) and SHALL NOT invent facts such as years in business, awards, or dishes not evidenced in the data. When data is thin, the copy SHALL stay conservative and only reference what is known.

#### Scenario: No fabricated facts
- **WHEN** the business data does not mention an award, founding year, or specific dish
- **THEN** the generated copy does not state such facts

#### Scenario: Thin data stays conservative
- **WHEN** the business has few or no reviews and no editorial summary
- **THEN** the generated copy remains general and avoids specific claims it cannot support

### Requirement: Server-side key and configurable model
The system SHALL call the AI provider (OpenRouter) only from the server, keeping the API key server-side, and SHALL allow the model to be configured without code changes.

#### Scenario: Key never reaches the client
- **WHEN** copy is generated
- **THEN** the provider API key is used only server-side and is never sent to the browser

#### Scenario: Model configurable
- **WHEN** an operator sets the model via environment configuration
- **THEN** generation uses the configured model, falling back to a sensible default when unset

### Requirement: Graceful fallback on failure
If generation fails (network, provider, quota, or invalid output), the system SHALL fall back to the non-AI default copy and still let the owner proceed to the studio.

#### Scenario: Provider error
- **WHEN** the AI request fails or returns unusable output
- **THEN** the site keeps the non-AI default copy and the owner can continue editing without a blocking error

#### Scenario: Validated output
- **WHEN** the AI returns content
- **THEN** the system validates it against the expected structure before applying it, and ignores malformed results
