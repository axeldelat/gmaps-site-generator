## ADDED Requirements

### Requirement: One-click deploy to Vercel
The system SHALL deploy the generated site to Vercel in response to a single user action, using the site template and the user's saved edits and business data.

#### Scenario: Successful deployment
- **WHEN** a user clicks "Deploy" on a finished preview
- **THEN** the system creates a Vercel deployment containing the template plus the user's data and edits, and returns a live URL once the deployment is ready

#### Scenario: Deployment in progress
- **WHEN** a deployment has been triggered but is not yet live
- **THEN** the system shows the user a clear in-progress status until the deployment completes or fails

### Requirement: Surface deployment result
The system SHALL present the resulting live site URL to the user on success and a clear error on failure.

#### Scenario: Deployment succeeds
- **WHEN** a Vercel deployment finishes successfully
- **THEN** the system displays the live site URL to the user and allows them to open it

#### Scenario: Deployment fails
- **WHEN** a Vercel deployment fails
- **THEN** the system shows a non-technical error message and allows the user to retry, while logging details server-side

### Requirement: Deployed site is publicly accessible
The deployed site SHALL be publicly viewable without any login or password, so a non-technical owner can share the URL with their customers.

#### Scenario: Live URL opens without authentication
- **WHEN** a deployment finishes and the live URL is opened by an anonymous visitor
- **THEN** the site is served directly without a login, SSO, or password prompt

### Requirement: Protect deployment credentials
The system SHALL keep the Vercel API token and Google API key server-side only and never expose them to the browser.

#### Scenario: Secrets not exposed to client
- **WHEN** the client triggers a deployment
- **THEN** the deployment is performed by server-side code and no API token or key is sent to or readable by the browser
