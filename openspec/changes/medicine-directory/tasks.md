## 1. Types & API layer

- [x] 1.1 Define `types/medicine.ts` — internal `Medicine` type with all display fields optional, plus `MedicineSummary` for search results
- [x] 1.2 Implement `lib/openfda.ts`: `searchMedicines(query: string)` querying `openfda.brand_name` and `openfda.generic_name`, with `AbortController` timeout
- [x] 1.3 Implement `lib/openfda.ts`: `getMedicineByBrandName(name: string)` for the details page, returning zero, one, or many matching records
- [x] 1.4 Implement mapping functions from raw openFDA JSON → internal `Medicine`/`MedicineSummary`, with per-field fallback copy (e.g. "Dosage information is not available.")
- [x] 1.5 Implement slug utilities: `slugify(brandName)` and `slugToSearchTerm(slug)` in `lib/slug.ts`

## 2. Homepage — search

- [x] 2.1 Set up TanStack Query provider (client-side only, scoped to homepage)
- [x] 2.2 Build `components/SearchBar.tsx` (debounced input, ~400ms)
- [x] 2.3 Build `components/MedicineCard.tsx` showing brand name + distinguishing detail (dosage form/strength) for results list
- [x] 2.4 Build `components/ErrorState.tsx` and empty-state component with the "no medicines found" guidance copy
- [x] 2.5 Wire up `app/page.tsx`: search input, loading/empty/error/results states, result cards linking to `/medicine/[slug]?q=<original-brand-name>`

## 3. Medicine details page

- [x] 3.1 Build `app/medicine/[name]/page.tsx` as an async Server Component: resolve slug (or `?q=` param) → `getMedicineByBrandName`
- [x] 3.2 Handle zero-match case: render not-found state
- [x] 3.3 Handle multi-match case: render disambiguation view listing distinguishing records
- [x] 3.4 Handle single-match case: render Brand Name (h1) → Generic Name → Active Ingredients → Purpose → Warnings → Dosage & Administration, each with fallback copy for missing fields
- [x] 3.5 Add persistent disclaimer component (visible, not footer-buried)

## 4. SEO

- [x] 4.1 Implement `generateMetadata` on the details page: dynamic title + meta description from brand name and purpose
- [x] 4.2 Add canonical URL tag pointing to base `/medicine/[name]` (including from disambiguation view)
- [x] 4.3 Verify semantic heading hierarchy (single h1, nested h2s) across details page states (found / not-found / disambiguation)
- [x] 4.4 Add homepage metadata (title, description) via `app/layout.tsx` / `app/page.tsx` metadata export

## 5. Responsive design & polish

- [x] 5.1 Mobile-first layout pass on homepage (search bar, result cards) and details page (single-column, readable line lengths)
- [x] 5.2 Verify Tailwind spacing/typography scale is consistent between homepage and details page
- [x] 5.3 Accessibility pass: focus states on search input and result cards, sufficient color contrast, alt text where applicable

## 6. Error handling & edge cases

- [x] 6.1 Verify empty/whitespace-only search input does not fire an API call
- [x] 6.2 Verify network failure / timeout on homepage search shows retry-capable error state
- [x] 6.3 Verify network failure / timeout on details page shows a details-page-appropriate error state
- [x] 6.4 Manually test symptom-style query (e.g. "fever tablet") to confirm no inferred medicine is ever shown

## 7. Final review

- [x] 7.1 Run through all six user journeys from proposal.md end-to-end
- [x] 7.2 Lint (`npm run lint`) and type-check (`tsc --noEmit`) clean
- [x] 7.3 Production build (`next build`) succeeds with no warnings
- [x] 7.4 Update README.md with project overview, setup instructions, and key engineering/product decisions
