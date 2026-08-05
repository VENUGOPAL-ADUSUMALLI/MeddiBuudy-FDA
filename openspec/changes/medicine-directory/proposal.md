## Why

India-based users frequently need to quickly check what a medicine is, what it's for, and how to take it safely — but the source of truth (FDA drug labels) is dense, US-centric, and not written for a general audience. There is no lightweight, trustworthy directory that lets someone search a medicine by brand or generic name and get clear, honest information without the product pretending to know more than it does (e.g. guessing a medicine from symptoms). This change builds that directory as a frontend-only Next.js app against the public openFDA Drug Label API, and exists to demonstrate product and engineering judgment, not just API consumption.

## What Changes

- Add a homepage with a search experience: search by brand or generic name, results list, loading/empty/error states, and clear handling of multiple formulations of the same medicine (e.g. Dolo 650 vs Dolo Suspension).
- Add a medicine details page at `/medicine/[name]` showing brand name, generic name, active ingredients, purpose, warnings, dosage & administration, and a medical disclaimer, with SEO metadata (dynamic titles, descriptions, canonical URLs, semantic HTML).
- Explicitly exclude symptom-based recommendation: queries that describe a symptom or ailment rather than a medicine name (e.g. "fever tablet") must return a guidance message directing the user to search by brand or generic name — never a guessed medicine.
- Establish graceful degradation for incomplete/missing openFDA fields (e.g. "Dosage information is not available." instead of blank/undefined).



## Capabilities



### New Capabilities

- `medicine-search`: Homepage search — query input, calling the openFDA label API by brand/generic name, results list with loading/empty/error/multi-formulation states, and refusal to guess medicines from symptom-style queries.
- `medicine-details`: Details page at `/medicine/[name]` — fetching a single medicine's label data, rendering brand name, generic name, active ingredients, purpose, warnings, dosage & administration, and a disclaimer, with graceful fallbacks for missing fields.
- `medicine-seo`: SEO and metadata strategy for both pages — dynamic `<title>`/meta description generation, canonical URLs, semantic heading hierarchy, and URL structure (e.g. slugging medicine names for `/medicine/[name]`).



### Modified Capabilities

(none — this is a new project, no existing specs)

## Impact

- **Affected code**: entire `app/`, `components/`, `lib/`, `types/` tree of the Next.js project (greenfield — nothing exists yet beyond the scaffold).
- **External dependency**: public openFDA Drug Label API (`api.fda.gov/drug/label.json`) — no API key, no auth, no backend, no database. All rate-limit, timeout, and malformed-response handling happens client/server-side in the Next.js app itself.
- **Out of scope** (explicitly not built): symptom-to-medicine recommendation, diagnosis, chatbot/medical-assistant UX, authentication, backend services, database, Redux, or any state-management/architecture heavier than what a directory app needs.

---



## Product Specification (Phase 1 — Product Discovery)



### Who are the users?

Primarily Indian consumers on mobile devices who already have a medicine name in mind (from a doctor's prescription, a strip in hand, or word of mouth) and want fast, trustworthy confirmation of what it is and how to take it. They may know the medicine only by its Indian brand name (Dolo, Crocin) or only by its generic/chemical name (Paracetamol), and may not know pharmacological terminology. They are not researchers and are not trying to self-diagnose — they already have a medicine name; they need it explained simply.

### What problem are we solving?

Bridging the gap between a name on a strip/prescription and an understanding of what that medicine actually is — safely, quickly, and without overwhelming or misleading the user. The core trust problem: US FDA label data is being used to inform a UX aimed at Indian users, so the app must never imply clinical authority beyond what the source data supports, and must never bridge missing data with a guess.

### User journeys

1. **Known brand name → details.** User searches "Dolo" → sees Dolo 650, Dolo 500, Dolo Suspension as distinct results → picks one → lands on `/medicine/dolo-650` with full label info.
2. **Known generic name → details.** User searches "Paracetamol" → the same underlying medicines surface via generic-name matching → same details flow.
3. **Typo / unlisted medicine → guided empty state.** User searches "XYZMedicine" or misspells a name → openFDA returns nothing → friendly empty state suggesting they try a brand or generic name, not a blank page or console error.
4. **Symptom-style query → explicit refusal to guess.** User searches "fever tablet" → this is product-critical: the app must recognize (or simply let openFDA's own no-match behavior handle it) that this isn't a medicine name and must not surface Paracetamol/Dolo as an inferred answer. The empty-state copy doubles as the safety mechanism here — we don't need separate "symptom detection" logic, we just need to never guess when there's no direct name match.
5. **Multiple formulations → disambiguation, not confusion.** Searching "Crocin" surfaces Crocin, Crocin 500, Crocin Advance, Crocin Cold as separate cards with enough distinguishing info (full product name, and ideally strength/purpose if openFDA provides it) that the user can tell them apart before clicking.
6. **Network/API failure → visible, non-blocking error.** Timeout or 5xx from openFDA → visible error state with the option to retry, never a silent blank screen.



### Product decisions

- **No inference, ever.** The product's credibility rests on never presenting a guess as fact. If openFDA doesn't return a direct match, the answer is "not found," full stop — this is the one non-negotiable product decision from the assignment brief and it should shape every downstream API/UI decision.
- **Search matches both brand and generic name.** This is a hard requirement (Example 2) and means the API layer needs to query on `openfda.brand_name` and `openfda.generic_name` (openFDA supports compound search), not just brand.
- **Formulation disambiguation happens on the results list, not after the click.** Users shouldn't have to open a details page to find out it was the wrong strength/form — the card itself should carry enough info to distinguish it.
- **Every missing field gets a human sentence, not blank/undefined.** This is both a trust decision and an engineering discipline (typed optional fields, explicit fallback copy per field).
- **Disclaimer is a persistent, visible UI element on the details page**, not buried in a footer — reinforces "this is FDA label information, not medical advice."



### Information architecture

- **Homepage**: search input (primary, above the fold) → results grid/list → each result is a card carrying brand name, and any short distinguishing detail (form/strength if available) → click-through to details.
- **Details page** (`/medicine/[name]`): single-column, mobile-first hierarchy — Brand Name (H1) → Generic Name → Active Ingredients → Purpose → Dosage & Administration → Warnings → Disclaimer, following the assignment's listed order exactly (confirmed decision — see design.md Decision 1).
- **URL structure**: `/medicine/[name]` uses a slugified, human-readable identifier (e.g. `dolo-650`) rather than an opaque openFDA id, since it needs to double as an SEO-friendly, shareable URL.



### Trade-offs

- **Slug-based routing vs. openFDA's own identifiers**: openFDA records don't have a stable, pretty slug — we'll need to derive one from brand name (+ maybe dosage form) ourselves and re-query by name on the details page. Trade-off: simpler, prettier URLs vs. a small risk of slug collisions between similarly-named products, which we'll need a tie-breaking strategy for in Phase 2.
- **Client-side vs. server-side fetching**: server-side fetching (Server Components / route handlers) gives better SEO and avoids exposing the openFDA call pattern in the client bundle, at the cost of losing some client-side interactivity conveniences (e.g. TanStack Query's cache/retry ergonomics for the search-as-you-type case). Likely resolution: server-rendered details page for SEO, client-side interactive search on the homepage — to be finalized in Phase 2.
- **Strict name-match search vs. fuzzy/typo-tolerant search**: openFDA's search isn't fuzzy by default. Adding fuzzy matching improves recall for typos but increases the risk of surprising, low-relevance matches that undermine trust. Recommendation: start strict (openFDA's native matching), revisit only if it produces too many false empty-states.



### Edge cases (product-level, not exhaustive engineering list)

- No results for a real-sounding but unlisted query.
- Symptom/ailment-style queries (must never resolve to a guessed medicine).
- Multiple formulations sharing a near-identical name.
- openFDA record missing one or more display fields (warnings, dosage, etc. are all independently optional in the API).
- Network failure / timeout / non-200 response.
- Very short or empty search queries (should not trigger an API call against the whole database, or if it does, results must still be meaningful).



### Features that should NOT be included

- Symptom-to-medicine recommendation or diagnosis of any kind.
- A chatbot or conversational "medical assistant" framing.
- Any UI language that could be read as a doctor's recommendation or dosage prescription rather than a reproduction of FDA label text.
- Authentication, user accounts, saved history, backend, database — this is a static/stateless directory over a public API.

---

**Open questions — resolved by the product owner, see design.md for full rationale:**

1. Details page order: follow the assignment's listed order exactly (Dosage before Warnings) — literal compliance chosen over an unprompted safety-first reorder.
2. Fetching split: server-rendered details page + client-side interactive homepage search with TanStack Query, confirmed as-proposed.
3. Slug collisions: hash-suffixed slugs for guaranteed uniqueness upfront, rather than a same-URL disambiguation view — correctness of resolution logic prioritized over URL prettiness.

