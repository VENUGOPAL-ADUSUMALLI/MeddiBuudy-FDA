## Context

Greenfield Next.js (App Router, TypeScript, Tailwind) project. No backend, no database, no auth, no API key. All medicine data comes live from the public openFDA Drug Label API (`https://api.fda.gov/drug/label.json`). Proposal.md defines three capabilities: `medicine-search` (homepage), `medicine-details` (`/medicine/[name]`), `medicine-seo`. This document resolves the open questions raised in Phase 1 and lays out the technical approach for Phase 2/implementation.

## Goals / Non-Goals

**Goals:**
- Fast, mobile-first search over openFDA by brand or generic name.
- SEO-friendly, server-rendered details pages with stable, readable URLs.
- Graceful handling of missing fields, empty results, and API failures — never a raw "undefined" or blank screen.
- Deterministic, collision-safe slugs for `/medicine/[name]`.

**Non-Goals:**
- No symptom → medicine inference of any kind.
- No caching layer/database — every request hits openFDA live (openFDA responses may be cached at the fetch layer via Next.js's built-in fetch cache for performance, but there is no persistence layer).
- No authentication, no user accounts, no saved searches.
- No fuzzy/typo-tolerant search in v1 — rely on openFDA's native matching.

## Decisions

### 1. Details page information order: assignment order (Dosage before Warnings)
**Decision (stakeholder call):** Render order follows the assignment brief exactly — Brand Name → Generic Name → Active Ingredients → Purpose → Dosage & Administration → Warnings → Disclaimer.
**Why:** This was raised as an open question (should Warnings be promoted above Dosage for safety-first hierarchy?) and the product owner chose to follow the assignment's listed order exactly rather than deviate from the brief unprompted. The trade-off — a user skimming only the top of the page sees dosing before contraindications — was explicitly accepted in favor of matching the stated spec.
**Alternative considered:** Warnings promoted above Dosage for safety-first hierarchy — this was the initial engineering proposal; rejected by the product owner in favor of literal compliance with the brief.

### 2. Fetching strategy: Server Components for details, client-side interactive search for homepage
**Decision:**
- `/medicine/[name]` is a Server Component (async, fetches openFDA server-side) so content is present in the initial HTML for SEO/crawlers and `generateMetadata` can produce accurate per-page title/description before any client JS runs.
- Homepage search is a Client Component: user types → debounced client-side fetch (via a small `lib/openfda.ts` fetch wrapper, not a route handler, since there's no need to hide anything — no API key involved) → renders results with loading/empty/error states.
- TanStack Query is used only on the homepage (search-as-you-type benefits from its built-in debounce-adjacent caching, request de-duping, and stale-state handling). The details page has no need for a client cache since it's a single server-rendered fetch per navigation — adding TanStack Query there would be unused ceremony.
**Why:** This gives SEO where it matters (details pages, which are the shareable/indexable content) without paying Client Component cost on that page, while keeping the interactive search snappy where interactivity is the whole point.
**Alternative considered:** TanStack Query everywhere, including details page (prefetched server-side then hydrated) — rejected as unnecessary complexity for a single fetch-and-render page; would only pay off if we needed client-side revalidation/mutation on that page, which we don't.
**Stakeholder confirmation:** This was raised as an open question (same pattern for both pages vs. specialized per page, or drop TanStack Query entirely since it's a bonus, not a requirement). The product owner confirmed the specialized split — SEO matters enough on the details page to justify a different pattern than the homepage, and TanStack Query earns its place specifically for the interactive search case.

### 3. Slug generation and collision handling: hash-suffixed slugs
**Decision (stakeholder call):** Slug = `kebab(brandName)` + a short deterministic hash of a uniqueness key (product NDC, or `manufacturer|route|brandName` as a fallback when NDC is missing) — e.g. `tylenol-extra-strength-7abbc9`. Every result card links to its own record's exact slug, so collisions between distinct openFDA records sharing a brand name (e.g. two manufacturers both labeling "Advil") never produce an ambiguous URL: each formulation gets a guaranteed-unique link from the moment it's rendered as a search result.
On the details route, resolution re-queries openFDA by brand name (from `?q=` or the slug's kebab prefix) and matches the exact slug against the candidates' own computed slugs. If no candidate's slug matches exactly (e.g. someone hand-types `/medicine/tylenol` without the hash, and multiple Tylenol records exist), the app reports not-found rather than guessing which formulation was meant — preserving the "don't guess" principle from the product spec.
**Why:** This was raised as an open question against two alternatives (a same-URL disambiguation view, or simply picking the first match and accepting the risk). The product owner chose guaranteed uniqueness upfront over a disambiguation-view UI, prioritizing correctness and simplicity of the resolution logic over the very small URL-prettiness cost of the hash suffix.
**Alternatives considered:**
- Same-URL disambiguation view (initial engineering proposal): render a "choose one" list at the shared slug when multiple records match — rejected in favor of eliminating the ambiguity structurally instead of surfacing it as a UI state.
- Pick the first match and accept the risk: rejected as inconsistent with the product's core "never guess" principle — silently picking a possibly-wrong formulation is a worse failure mode than a rare not-found on a hand-typed URL.

### 4. API layer shape
**Decision:** Single `lib/openfda.ts` module exporting typed functions: `searchMedicines(query: string)` and `getMedicineByBrandName(name: string)`, both wrapping `fetch` against `api.fda.gov`, handling non-200s, timeouts (via `AbortController`), and mapping openFDA's raw response shape into an internal `Medicine` type (`types/medicine.ts`) with all display fields optional and pre-normalized (e.g. `warnings?: string`, arrays flattened to first-usable string). All "is this field missing" logic lives in this mapping layer, not scattered across components.
**Why:** Keeps components dumb (render `Medicine`, never raw openFDA JSON), keeps fallback-copy logic in one place, and makes it trivial to unit-test the mapping independent of the UI.

### 5. Symptom-style queries: transparent purpose-keyword guide (stakeholder call)
**Context:** The product owner asked why "fever tablet" or "i am having stomach pain" don't surface related drugs, given that's how users naturally search. The assignment brief explicitly forbids inferring/recommending a medicine from a symptom query, so a literal reinterpretation of that request would break a stated requirement.
**Decision:** When the direct brand/generic name search returns zero results, additionally run a second, clearly-separate lookup against openFDA's own `purpose` label field for literal keyword matches (e.g. "stomach", "pain" — stopwords stripped from the query). Results render in a visually distinct block beneath the no-results message, explicitly labeled "Not a medicine name — but here's a keyword match," with copy stating this is a text match on FDA label data, not a recommendation, plus a "consult a doctor or pharmacist" disclaimer. The primary no-results guidance state is never replaced or suppressed by this block.
**Why:** This satisfies the underlying product need (useful results for natural-language symptom queries) without crossing the brief's explicit line — the app is transparently telling the user *why* something matched (a literal keyword in FDA's own purpose text), never presenting it as clinical judgment or a personalized suggestion. Two other options were on the table and explicitly rejected by the stakeholder: keep current behavior unchanged (loses real product value), or drop the no-inference rule entirely and treat symptom queries as real search (violates the brief).
**Implementation note:** A single OR query across extracted keywords is dominated by whichever keyword is most common ("pain" swamps "stomach"), burying more specific/useful matches. Fixed by querying each keyword's `purpose` field separately, merging the pools, and ranking by how many distinct keywords each record's purpose text actually contains — verified against live data that this surfaces recognizable, relevant matches (e.g. "Pepto-Bismol" for "stomach pain") instead of only generic pain relievers.

## Risks / Trade-offs

- **[Risk]** openFDA has no fuzzy matching → legitimate near-miss queries (minor typos) surface as "no results." → **[Mitigation]** Empty-state copy explicitly invites retry with brand/generic name; acceptable v1 trade-off per proposal's "start strict" decision.
- **[Risk]** Re-deriving search terms from slugs on the details page (reverse-kebab) could mismatch the original brand name's exact casing/spacing openFDA expects. → **[Mitigation]** Store the exact brand-name string as a query param fallback when navigating from search results (`?q=`) so the details page can use the exact string when available, falling back to the reversed-slug guess only for direct URL visits.
- **[Risk]** A hand-typed or old-format URL without the hash suffix, for a brand name with multiple distinct records, will report not-found even though a medicine of that name exists. → **[Mitigation]** Accepted per the stakeholder's "don't guess" priority (Decision 3) — this only affects direct/manual URL entry, not the primary search → click flow, where every link already carries the exact slug.
- **[Risk]** openFDA rate limits (240 req/min/IP without a key) could throttle a client-heavy search-as-you-type UX. → **[Mitigation]** Debounce input (e.g. 400ms) before firing search requests; TanStack Query de-dupes repeat identical queries.
- **[Trade-off]** No persistence means every details-page visit re-hits openFDA — acceptable given Next.js's fetch caching can serve repeat requests for the same URL within its revalidation window without a real backend cache.

## Open Questions
None outstanding — all three Phase 1 questions resolved above per user direction to proceed to implementation.
