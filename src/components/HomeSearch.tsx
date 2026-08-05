"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { PopularSearches } from "@/components/PopularSearches";
import { SymptomGuide } from "@/components/SymptomGuide";
import { ErrorState, EmptyState, LoadingState } from "@/components/ErrorState";
import { searchMedicines, searchByPurposeKeywords } from "@/lib/openfda";

const DEBOUNCE_MS = 400;

export function HomeSearch() {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(inputValue.trim()), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [inputValue]);

  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["medicine-search", debouncedQuery],
      queryFn: ({ pageParam }) => searchMedicines(debouncedQuery, pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      enabled: debouncedQuery.length > 0,
    });

  // Load the next page automatically as the sentinel scrolls into view,
  // rather than requiring a "Load more" click.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  function pick(term: string) {
    setInputValue(term);
    setDebouncedQuery(term);
  }

  const medicines = data?.pages.flatMap((page) => page.results) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const nameSearchIsEmpty = debouncedQuery.length > 0 && !isLoading && !isError && medicines.length === 0;

  // Only runs once the direct brand/generic name search has already come up
  // empty — never replaces or races the primary name match.
  const { data: symptomMatches, isLoading: isSymptomLoading } = useQuery({
    queryKey: ["symptom-guide", debouncedQuery],
    queryFn: () => searchByPurposeKeywords(debouncedQuery),
    enabled: nameSearchIsEmpty,
  });

  return (
    <>
      <section className="bg-teal-950 px-4 pb-10 pt-14 sm:px-6 dark:bg-black">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Know what you&apos;re <span className="text-teal-400">taking.</span>
          </h1>
          <p className="mt-3 max-w-md text-base text-teal-200/80">
            Search any medicine by brand or generic name and read its FDA label in plain terms —
            ingredients, purpose, warnings, dosage.
          </p>

          <div className="mt-7 max-w-xl">
            <SearchBar value={inputValue} onChange={setInputValue} />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PopularSearches onPick={pick} variant="dark" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-teal-200/50">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              FDA-sourced · Updated live · Built for mobile
            </span>
          </div>
        </div>
      </section>

      <section className="min-h-[8rem] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {debouncedQuery.length > 0 && isLoading && <LoadingState />}

          {debouncedQuery.length > 0 && isError && (
            <ErrorState
              message="We couldn't reach the medicine database. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          )}

          {nameSearchIsEmpty && (
            <>
              <EmptyState query={debouncedQuery} onPickSuggestion={pick} />
              {isSymptomLoading && <LoadingState />}
              {symptomMatches && <SymptomGuide medicines={symptomMatches} query={debouncedQuery} />}
            </>
          )}

          {debouncedQuery.length > 0 && !isLoading && !isError && medicines.length > 0 && (
            <>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {medicines.length} of {total} {total === 1 ? "result" : "results"} for &ldquo;
                {debouncedQuery}&rdquo;
              </p>
              <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={`${medicine.slug}-${medicine.productNdc ?? medicine.brandName}`}
                    medicine={medicine}
                  />
                ))}
              </div>

              {/* Sentinel: fetches the next page automatically once scrolled into view */}
              <div ref={sentinelRef} className="flex justify-center py-2">
                {isFetchingNextPage && (
                  <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" aria-hidden />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
