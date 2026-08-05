## ADDED Requirements

### Requirement: Dynamic page metadata
Each medicine details page SHALL have a dynamically generated page title and meta description derived from that medicine's brand name and purpose, generated server-side before first paint.

#### Scenario: Details page metadata reflects the medicine
- **WHEN** a details page is server-rendered for "Dolo 650"
- **THEN** the generated `<title>` and meta description reference "Dolo 650" and, when available, its purpose, and are present in the initial server-rendered HTML

### Requirement: Canonical URL
Each medicine details page SHALL declare a canonical URL pointing to its own unique slug (`/medicine/[name]`), independent of any query parameters used to resolve it.

#### Scenario: Canonical URL on a details page
- **WHEN** a details page is rendered for a medicine reached via a `?q=` query parameter
- **THEN** the page declares a canonical `<link>` pointing to `/medicine/[name]` without that query parameter

### Requirement: Semantic heading hierarchy
The details page SHALL use a single `<h1>` for the medicine's brand name, with subsequent sections (Generic Name, Active Ingredients, Purpose, Warnings, Dosage & Administration) using appropriately nested heading levels.

#### Scenario: Heading structure on details page
- **WHEN** a details page is rendered
- **THEN** the brand name is the page's only `<h1>`, and each subsequent information section uses a heading level below it (e.g. `<h2>`)

### Requirement: SEO-friendly URL structure
Medicine details URLs SHALL use a human-readable slug that leads with a kebab-case rendering of the brand name, rather than an opaque database or API identifier as the entire path segment.

#### Scenario: Slug is human-readable
- **WHEN** a user navigates to a medicine's details page
- **THEN** the resulting URL path segment begins with a kebab-case rendering of the brand name (e.g. `dolo-650-<hash>`), not a purely opaque ID
