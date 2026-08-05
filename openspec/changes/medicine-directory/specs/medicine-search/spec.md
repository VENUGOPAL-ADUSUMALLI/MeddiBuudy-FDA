## ADDED Requirements

### Requirement: Search by brand or generic name
The system SHALL query the openFDA drug label API against both `openfda.brand_name` and `openfda.generic_name` fields for any non-empty search input, and SHALL treat a match on either field as a valid result.

#### Scenario: Search matches brand name
- **WHEN** a user submits the query "Dolo"
- **THEN** the system returns all openFDA records whose `openfda.brand_name` matches "Dolo", including distinct formulations (e.g. Dolo 650, Dolo 500, Dolo Suspension)

#### Scenario: Search matches generic name
- **WHEN** a user submits the query "Paracetamol"
- **THEN** the system returns openFDA records whose `openfda.generic_name` matches "Paracetamol", even if "Paracetamol" does not appear in any `brand_name`

### Requirement: No symptom-based inference
The system SHALL NOT infer, recommend, or silently substitute a medicine as if it were a direct name match in response to a query that does not match a brand or generic name field, even if the query describes a symptom or ailment. The no-results guidance state SHALL always be shown for such a query, regardless of any supplementary keyword suggestions shown alongside it (see "Transparent purpose-keyword guide").

#### Scenario: Symptom-style query returns no inferred medicine
- **WHEN** a user submits the query "fever tablet"
- **THEN** the system SHALL NOT return Paracetamol, Dolo, or any other medicine as an inferred direct match, and SHALL render the no-results guidance state

### Requirement: Transparent purpose-keyword guide
When a name search returns zero results, the system MAY additionally search openFDA's `purpose` label field for literal keyword matches extracted from the query (stopwords removed), and display any matches in a visually and textually distinct block that is explicitly labeled as a keyword match on FDA label text — never phrased as a recommendation, diagnosis, or personalized suggestion — accompanied by a disclaimer to consult a doctor or pharmacist. This block SHALL only appear alongside, never instead of, the no-results guidance state.

#### Scenario: Symptom-style query with a purpose-field keyword match
- **WHEN** a user submits the query "i am having stomach pain" and it matches no brand/generic name
- **THEN** the system shows the no-results guidance state AND, if openFDA records exist whose `purpose` field literally contains "stomach" or "pain", displays them in a separate block labeled as a keyword match, not a recommendation

#### Scenario: Symptom-style query with no purpose-field match
- **WHEN** a user submits a query with no name match and no `purpose`-field keyword match
- **THEN** the system shows only the no-results guidance state, with no keyword-guide block

### Requirement: Loading state
The system SHALL display a visible loading indicator while a search request is in flight.

#### Scenario: Loading indicator shown during fetch
- **WHEN** a user submits a search query
- **THEN** the system displays a loading indicator until the openFDA response (success or failure) is received

### Requirement: Empty results state
The system SHALL display a friendly, actionable message when a search returns zero matches, and SHALL NOT display a blank page or raw "undefined"/error text.

#### Scenario: No matches found
- **WHEN** a user submits a query that matches no openFDA record (e.g. "XYZMedicine")
- **THEN** the system displays a message stating no medicines were found and suggesting the user search by brand or generic name

### Requirement: API failure handling
The system SHALL display a visible, non-blocking error state when the openFDA request fails (network failure, timeout, or non-2xx response), and SHALL allow the user to retry the search.

#### Scenario: Network failure during search
- **WHEN** the openFDA request fails due to a network error or timeout
- **THEN** the system displays an error message distinct from the empty-results message, with a retry action

### Requirement: Multiple formulation disambiguation
The system SHALL render each distinct openFDA record as a separate result card carrying enough distinguishing information (full product name, and dosage form/strength when available) for the user to tell formulations apart before navigating to a details page.

#### Scenario: Multiple formulations of the same brand
- **WHEN** a search for "Crocin" returns multiple records (Crocin, Crocin 500, Crocin Advance, Crocin Cold)
- **THEN** the system displays each as a distinct, individually distinguishable result card
