"use client";

import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck, HeartPulse } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { MedicineCard } from "@/components/MedicineCard";
import { PopularSearches } from "@/components/PopularSearches";
import { SymptomGuide } from "@/components/SymptomGuide";
import { IndianContextBanner } from "@/components/IndianContextBanner";
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
  const synonymMatch = data?.pages[0]?.synonymMatch;
  const nameSearchIsEmpty = debouncedQuery.length > 0 && !isLoading && !isError && medicines.length === 0;

  const { data: symptomMatches, isLoading: isSymptomLoading } = useQuery({
    queryKey: ["symptom-guide", debouncedQuery],
    queryFn: () => searchByPurposeKeywords(debouncedQuery),
    enabled: nameSearchIsEmpty,
  });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950 via-slate-950 to-slate-900 px-4 pb-12 pt-16 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.15),transparent_50%)] pointer-events-none" />
        <div className="mx-auto max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-800/60 bg-teal-950/60 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md mb-4">
            <HeartPulse className="h-3.5 w-3.5 text-teal-400" />
            <span>Trusted FDA Drug Information for Patients</span>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Know what you&apos;re <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">taking.</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm sm:text-base text-slate-300 leading-relaxed">
            Search any medicine by brand name (e.g. <span className="text-teal-300 font-semibold">Dolo 650</span>) or generic name (e.g. <span className="text-teal-300 font-semibold">Paracetamol</span>) and inspect verified FDA label info in clear terms.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchBar value={inputValue} onChange={setInputValue} />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PopularSearches onPick={pick} variant="dark" />
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
              FDA Live API · Indian Synonym Mapper
            </span>
          </div>
        </div>
      </section>

      <section className="min-h-[12rem] px-4 py-8 sm:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {debouncedQuery.length > 0 && isLoading && <LoadingState />}

          {debouncedQuery.length > 0 && isError && (
            <ErrorState
              message="Could not connect to the openFDA database. Please verify your network connection and try again."
              onRetry={() => refetch()}
            />
          )}

          {synonymMatch && <IndianContextBanner synonym={synonymMatch} />}

          {nameSearchIsEmpty && (
            <>
              <EmptyState query={debouncedQuery} onPickSuggestion={pick} />
              {isSymptomLoading && <LoadingState />}
              {symptomMatches && <SymptomGuide medicines={symptomMatches} query={debouncedQuery} />}
            </>
          )}

          {debouncedQuery.length > 0 && !isLoading && !isError && medicines.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Found {total} matching {total === 1 ? "formulation" : "formulations"} for &ldquo;{debouncedQuery}&rdquo;
                </p>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Select a medicine card for full FDA details
                </span>
              </div>

              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={`${medicine.slug}-${medicine.productNdc ?? medicine.brandName}`}
                    medicine={medicine}
                  />
                ))}
              </div>

              <div ref={sentinelRef} className="flex justify-center py-4">
                {isFetchingNextPage && (
                  <Loader2 className="h-5 w-5 animate-spin text-teal-600 dark:text-teal-400" aria-hidden />
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
