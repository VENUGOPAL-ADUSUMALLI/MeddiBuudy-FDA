function kebab(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Deterministic 6-hex-char hash (djb2) — used to guarantee unique slugs
// even when two distinct openFDA records share the same brand name.
function shortHash(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

/**
 * Builds a human-readable, guaranteed-unique slug: kebab(brandName) + a short
 * hash of a uniqueness key (product NDC, or manufacturer+route as a fallback).
 */
export function slugify(brandName: string, uniqueKey: string): string {
  return `${kebab(brandName)}-${shortHash(uniqueKey)}`;
}

export function slugToSearchTerm(slug: string): string {
  return kebab(slug).replace(/-[0-9a-f]{6}$/, "").replace(/-/g, " ").trim();
}
