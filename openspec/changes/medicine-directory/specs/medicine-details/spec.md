## ADDED Requirements

### Requirement: Medicine details route
The system SHALL expose a details page at `/medicine/[name]`, where `[name]` is a kebab-case slug derived from the medicine's brand name plus a short deterministic hash of a uniqueness key (product NDC, or manufacturer+route as fallback), guaranteeing each distinct openFDA record maps to its own unique slug. The page server-renders the medicine's label information.

#### Scenario: Navigating to a details page
- **WHEN** a user clicks a search result for "Dolo 650"
- **THEN** the system navigates to `/medicine/dolo-650-<hash>` and server-renders that specific record's label data

### Requirement: Required information display
The details page SHALL display, when available, Brand Name, Generic Name, Active Ingredients, Purpose, Dosage & Administration, and Warnings, in that order (matching the assignment's specified field order).

#### Scenario: Full label data available
- **WHEN** the openFDA record for the requested medicine includes all display fields
- **THEN** the details page renders Brand Name, Generic Name, Active Ingredients, Purpose, Dosage & Administration, and Warnings, in that order

### Requirement: Graceful handling of missing fields
The system SHALL NOT render blank space, "undefined", or `null` for any missing openFDA field, and SHALL instead render a specific, human-readable fallback message per field.

#### Scenario: Missing dosage information
- **WHEN** the openFDA record for a medicine has no `dosage_and_administration` field
- **THEN** the details page displays "Dosage information is not available." in place of the field, not blank space or "undefined"

### Requirement: Persistent medical disclaimer
The details page SHALL display a persistent, visible disclaimer stating the content is FDA label information and not medical advice.

#### Scenario: Disclaimer visible on every details page
- **WHEN** a user views any medicine details page
- **THEN** a disclaimer is visibly rendered on the page (not hidden in a collapsed section or footer-only placement)

### Requirement: No arbitrary selection among distinct records
When resolving a details-page slug, if openFDA returns more than one distinct record for the underlying brand name and none of their computed slugs matches the requested slug exactly, the system SHALL NOT arbitrarily pick one to display.

#### Scenario: Ambiguous slug with no exact match
- **WHEN** a user visits `/medicine/tylenol` (no hash suffix) and openFDA returns multiple distinct "Tylenol" records, none of whose computed slugs equals `tylenol`
- **THEN** the system displays the not-found state rather than guessing which record was meant

### Requirement: Details page not found
The system SHALL display a friendly not-found state when a details-page slug matches no openFDA record, or matches a brand name but not to any single record's exact computed slug.

#### Scenario: Slug matches no record
- **WHEN** a user visits `/medicine/[name]` for a slug that does not resolve to any openFDA record
- **THEN** the system displays a not-found message guiding the user back to search, rather than a raw 404 or blank page
