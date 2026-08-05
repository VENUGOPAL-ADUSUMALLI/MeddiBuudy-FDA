import type { Medicine, MedicineLookupResult, MedicineSummary } from "@/types/medicine";
import { slugify } from "@/lib/slug";
import { cleanupLabelText } from "@/lib/labelText";

const OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json";
const REQUEST_TIMEOUT_MS = 8000;

interface OpenFdaLabelResult {
  id?: string;
  purpose?: string[];
  warnings?: string[];
  dosage_and_administration?: string[];
  active_ingredient?: string[];
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
    manufacturer_name?: string[];
    route?: string[];
    product_ndc?: string[];
  };
  dosage_form?: string; // not a real openFDA top-level field but kept optional for forward-compat
}

interface OpenFdaResponse {
  results?: OpenFdaLabelResult[];
  meta?: { results?: { total?: number } };
  error?: { code: string; message: string };
}

export class OpenFdaRequestError extends Error {}

async function fetchOpenFda(
  searchExpression: string,
  limit: number,
  skip: number = 0
): Promise<{ results: OpenFdaLabelResult[]; total: number }> {
  const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchExpression)}&limit=${limit}&skip=${skip}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    throw new OpenFdaRequestError(
      err instanceof Error && err.name === "AbortError"
        ? "The request to openFDA timed out."
        : "Could not reach the openFDA API."
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 404) {
    // openFDA returns 404 for zero-match searches rather than an empty results array
    return { results: [], total: 0 };
  }

  if (!response.ok) {
    throw new OpenFdaRequestError(`openFDA API responded with status ${response.status}.`);
  }

  const data: OpenFdaResponse = await response.json();
  return { results: data.results ?? [], total: data.meta?.results?.total ?? 0 };
}

function firstOrUndefined(values?: string[]): string | undefined {
  return values && values.length > 0 ? values[0] : undefined;
}

function toSummary(result: OpenFdaLabelResult): MedicineSummary {
  const brandName = firstOrUndefined(result.openfda?.brand_name) ?? "Unknown medicine";
  const manufacturer = firstOrUndefined(result.openfda?.manufacturer_name);
  const route = firstOrUndefined(result.openfda?.route);
  const productNdc = firstOrUndefined(result.openfda?.product_ndc);
  // Prefer product NDC for uniqueness; fall back to manufacturer+route+brandName
  // for the rare record missing an NDC, so every slug is still guaranteed unique.
  const uniqueKey = productNdc ?? `${manufacturer ?? ""}|${route ?? ""}|${brandName}`;

  return {
    slug: slugify(brandName, uniqueKey),
    brandName,
    genericName: firstOrUndefined(result.openfda?.generic_name),
    dosageForm: route,
    purpose: cleanupLabelText(firstOrUndefined(result.purpose), "Purpose"),
    productNdc,
  };
}

function toMedicine(result: OpenFdaLabelResult): Medicine {
  const summary = toSummary(result);
  return {
    ...summary,
    activeIngredients: cleanupLabelText(firstOrUndefined(result.active_ingredient), "Active ingredients"),
    warnings: cleanupLabelText(firstOrUndefined(result.warnings), "Warnings"),
    dosageAndAdministration: cleanupLabelText(firstOrUndefined(result.dosage_and_administration), "Directions"),
    manufacturer: firstOrUndefined(result.openfda?.manufacturer_name),
  };
}

export const SEARCH_PAGE_SIZE = 10;

export interface SearchPage {
  results: MedicineSummary[];
  total: number;
  nextSkip: number | null;
}

/**
 * Searches openFDA by brand name OR generic name, one page at a time.
 * Never falls back to guessing a medicine when there is no direct name match.
 */
export async function searchMedicines(query: string, skip: number = 0): Promise<SearchPage> {
  const trimmed = query.trim();
  if (!trimmed) return { results: [], total: 0, nextSkip: null };

  const escaped = trimmed.replace(/"/g, '\\"');
  const searchExpression = `openfda.brand_name:"${escaped}" OR openfda.generic_name:"${escaped}"`;

  const { results, total } = await fetchOpenFda(searchExpression, SEARCH_PAGE_SIZE, skip);
  const nextSkip = skip + results.length < total ? skip + results.length : null;

  return { results: results.map(toSummary), total, nextSkip };
}

const SYMPTOM_STOPWORDS = new Set([
  "i",
  "im",
  "am",
  "is",
  "are",
  "the",
  "a",
  "an",
  "having",
  "have",
  "has",
  "my",
  "me",
  "with",
  "for",
  "of",
  "to",
  "in",
  "on",
  "and",
  "or",
  "feeling",
  "feel",
  "got",
  "get",
  "some",
  "bad",
  "really",
]);

/**
 * Extracts meaningful keywords from a free-text query like "i am having
 * stomach pain" -> ["stomach", "pain"], for the purpose-based keyword guide.
 */
function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !SYMPTOM_STOPWORDS.has(w));
}

/**
 * A transparent, literal keyword match against openFDA's own "purpose" label
 * field — e.g. searching "stomach pain" surfaces medicines whose FDA purpose
 * text literally contains "stomach" or "pain" ("Upset stomach reliever").
 * This is NOT symptom diagnosis or a personalized recommendation: it never
 * runs unless a direct brand/generic name search already came up empty, and
 * callers must present it as a keyword match, not a suggestion of what to take.
 */
export async function searchByPurposeKeywords(query: string): Promise<MedicineSummary[]> {
  const keywords = extractKeywords(query);
  if (keywords.length === 0) return [];

  // Query each keyword separately and merge the pools, rather than one OR
  // query — a single combined query gets dominated by whichever keyword is
  // most common ("pain"), burying more specific matches ("stomach") that
  // would otherwise never make it onto the first page of results.
  const pools = await Promise.all(keywords.map((kw) => fetchOpenFda(`purpose:${kw}`, 15)));
  const seenIds = new Set<string>();
  const results: OpenFdaLabelResult[] = [];
  for (const pool of pools) {
    for (const r of pool.results) {
      if (r.id && seenIds.has(r.id)) continue;
      if (r.id) seenIds.add(r.id);
      results.push(r);
    }
  }

  const purposeText = (r: OpenFdaLabelResult) => r.purpose?.join(" ").toLowerCase() ?? "";
  const matchCount = (r: OpenFdaLabelResult) => {
    const text = purposeText(r);
    return keywords.filter((kw) => text.includes(kw)).length;
  };

  const withBrand = results.filter((r) => r.openfda?.brand_name?.length && matchCount(r) > 0);
  // Prefer records whose purpose text hits every keyword (e.g. both "stomach"
  // and "pain") over ones that only hit a single word.
  const ranked = withBrand.sort((a, b) => matchCount(b) - matchCount(a));

  const seenBrands = new Set<string>();
  const matches: MedicineSummary[] = [];
  for (const r of ranked) {
    const summary = toSummary(r);
    const key = summary.brandName.toLowerCase();
    if (seenBrands.has(key)) continue;
    seenBrands.add(key);
    matches.push(summary);
    if (matches.length >= 5) break;
  }
  return matches;
}

/**
 * Resolves a medicine details lookup by an exact, hash-suffixed slug.
 * Every result card links with its own unique slug, so this normally
 * matches exactly one record. If openFDA returns several records sharing
 * a brand name and none of their computed slugs matches the requested
 * one exactly, we refuse to guess and report not-found rather than
 * picking a record arbitrarily.
 */
export async function getMedicineByBrandName(name: string, slug: string): Promise<MedicineLookupResult> {
  const trimmed = name.trim();
  if (!trimmed) return { kind: "not-found" };

  const escaped = trimmed.replace(/"/g, '\\"');
  const { results } = await fetchOpenFda(`openfda.brand_name:"${escaped}"`, 20);

  if (results.length === 0) return { kind: "not-found" };
  if (results.length === 1) return { kind: "found", medicine: toMedicine(results[0]) };

  const exactMatch = results.find((r) => toSummary(r).slug === slug);
  if (exactMatch) return { kind: "found", medicine: toMedicine(exactMatch) };

  return { kind: "not-found" };
}
