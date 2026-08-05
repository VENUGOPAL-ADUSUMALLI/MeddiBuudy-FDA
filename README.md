# Medicine Directory

A Medicine Directory built against the public [openFDA Drug Label API](https://open.fda.gov/apis/drug/label/). Search a medicine by brand or generic name and view its FDA label information — active ingredients, purpose, warnings, and dosage. No backend, no database, no auth, no API key.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · TanStack Query (`useInfiniteQuery` for paginated search, `useQuery` for the symptom-keyword guide)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Try It

- **Normal search:** `Tylenol`, `Advil`, `Ibuprofen` — openFDA is a US-only database, so these work; Indian brand names like "Dolo 650" won't (see below).
- **Symptom-style query:** search `stomach pain` (or `i am having stomach pain`). It won't return a direct match (correctly — the app never guesses a medicine from a symptom), but underneath the "no medicines found" message you'll see a separate, clearly-labeled block surfacing medicines whose FDA `purpose` text mentions "stomach" or "pain" (e.g. Pepto-Bismol) — a transparent keyword match, explicitly not a recommendation.
- **Multiple formulations:** search `Tylenol` and note the distinct entries (Extra Strength, Regular Strength, Sinus Severe, etc.), each with its own icon by dosage route and its own unique details-page URL.
- **Long Warnings section:** open any details page (e.g. Advil) and expand the Warnings accordion — every sub-warning is independently collapsible.



## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage (metadata export; body delegated to HomeSearch)
│   ├── layout.tsx
│   └── medicine/[name]/
│       ├── page.tsx             # Details page (Server Component, generateMetadata)
│       ├── not-found.tsx        # Friendly not-found state
│       └── error.tsx            # Details-page network/API error state
├── components/
│   ├── Header.tsx / Footer.tsx
│   ├── HomeSearch.tsx           # Client component: search state, pagination, wires everything below
│   ├── SearchBar.tsx
│   ├── PopularSearches.tsx      # "Try: Tylenol, Advil, ..." pills (hero + empty-state reuse)
│   ├── MedicineCard.tsx         # Search result row
│   ├── SymptomGuide.tsx         # Transparent purpose-keyword suggestions (see below)
│   ├── DetailField.tsx          # Details-page field renderer; accordion mode for long sections
│   ├── QuickJumpNav.tsx         # Sticky in-page nav on the details page
│   ├── Disclaimer.tsx
│   ├── ErrorState.tsx           # ErrorState, EmptyState, LoadingState
│   └── QueryProvider.tsx
├── lib/
│   ├── openfda.ts               # openFDA fetch, pagination, mapping, purpose-keyword search
│   ├── labelText.ts             # Cleans up openFDA's raw duplicated/unbroken label text
│   └── slug.ts                  # Hash-suffixed unique slugs
└── types/
    └── medicine.ts
```



## Key Product & Engineering Decisions

- **No inference, ever — but symptom queries aren't dead ends either.** If a query doesn't match a brand or generic name, the app never guesses a medicine (e.g. "fever tablet" still shows "no medicines found," not Paracetamol). But since real users search by symptom ("i am having stomach pain" — try it), a **transparent purpose-keyword guide** runs only after the name search comes up empty: it does a literal keyword match against openFDA's own `purpose` label field (stopwords stripped, e.g. "stomach", "pain") and shows any hits in a clearly separate, explicitly-labeled block — *"No medicine named '...' — but here's a keyword match"* — with copy stating these are FDA-labeled medicines whose purpose text mentions that word, a plain text match, not a recommendation, plus a consult-a-doctor disclaimer. It never replaces the no-results message, only supplements it. Querying each keyword separately and ranking by how many keywords each result actually hits (rather than one combined OR query) was necessary — a combined query got dominated by the most common word ("pain") and buried more specific matches like Pepto-Bismol for "stomach."
- **Search matches brand and generic name.** Both `openfda.brand_name` and `openfda.generic_name` are queried (as a proper `OR`, not string-concatenated `+`, which silently broke every search during development — caught by testing against live data, not just the happy path).
- **Field order follows the assignment brief exactly** (Dosage & Administration before Warnings) — an initial engineering proposal to promote Warnings above Dosage for a "safety-first" hierarchy was explicitly rejected in favor of literal compliance with the stated spec.
- **Server-rendered details page, client-side interactive search.** `/medicine/[name]` is an async Server Component for SEO (accurate `generateMetadata` before any client JS runs); the homepage search is a Client Component using TanStack Query for debounced fetching, pagination, and request de-duping.
- **Human-readable, collision-safe slugs.** `/medicine/[name]` uses `kebab(brandName) + short-hash(uniqueness-key)` (e.g. `tylenol-extra-strength-7abbc9`). Every search result links to its own guaranteed-unique slug, so two distinct products sharing a brand name never collide. A bare/hand-typed slug that can't be resolved to exactly one record reports not-found rather than guessing which formulation was meant.
- **No blank/undefined fields.** Every optional label field (warnings, dosage, active ingredients, etc.) renders a specific fallback sentence (e.g. "Dosage information is not available.") when openFDA doesn't provide it.
- **openFDA's raw label text is cleaned up before rendering.** The API returns section text with its own headers duplicated back-to-back and zero paragraph breaks (e.g. `"Warnings ​Warnings Acetaminophen liver damage warning Acetaminophen liver damage warning: ..."`), which is unreadable as-is. `lib/labelText.ts` strips the redundant leading label, collapses duplicated sub-headings, and splits the text into paragraphs.
- **Long sections (Warnings) use a uniform accordion, not a mixed layout.** Every warning paragraph — whether openFDA gave it a clean colon-terminated heading or not — is rendered as a collapsed one-line summary with a chevron; click to expand. Every row behaves identically (no mix of "some rows are dropdowns, some are plain text"), and every warning heading stays visible at a glance even before expanding, so nothing safety-critical is fully hidden by default.
- **Search results paginate via infinite scroll**, not a fixed 20-result cap — `useInfiniteQuery` fetches 10 at a time from openFDA's `skip`/`limit`, with an `IntersectionObserver` sentinel that loads the next page automatically as you scroll near the bottom.



## What I'd Do Differently With More Time

- **US ↔ Indian generic-name mapping.** openFDA is a US-only database, so searching "Paracetamol" (the Indian/British term) returns nothing — only "Acetaminophen" (the US term) works, even though they're the same drug. A small synonym table (Paracetamol → Acetaminophen, etc.) would fix this real gap for Indian users, who are this product's stated audience.
- **Tighter heading detection in** `labelText.ts`**.** The regex-based sub-heading splitter occasionally over-segments (e.g. treats "Symptoms may include:" as its own top-level warning instead of a sub-point of "Allergy alert") since openFDA's raw text has no real structure to parse against — a more robust fix would need actual SPL/XML parsing rather than regex heuristics on the flattened text.



## AI Tooling & Prompt History

Built with **Claude Code**. Full raw prompt history — every turn, including a rejected approach ("you decide" instead of making the call myself) and the correction that followed — is in [prompt-history.md](prompt-history.md).

## OpenSpec

This project was planned and implemented using [OpenSpec](https://github.com/Fission-AI/OpenSpec). The full product spec, architecture decisions, requirement specs, and implementation task list live under `openspec/changes/medicine-directory/` (proposal.md, design.md, specs/, tasks.md).