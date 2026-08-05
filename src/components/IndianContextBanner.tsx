import React from "react";
import { Globe2, Info } from "lucide-react";
import type { SynonymMatch } from "@/lib/synonyms";

interface IndianContextBannerProps {
  synonym: SynonymMatch;
}

export function IndianContextBanner({ synonym }: IndianContextBannerProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-cyan-50/60 p-4 shadow-xs dark:border-teal-900/50 dark:from-teal-950/40 dark:via-emerald-950/20 dark:to-cyan-950/30">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs dark:bg-teal-500">
          <Globe2 className="h-5 w-5" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-teal-900 dark:text-teal-200">
              Indian Healthcare Context
            </span>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[11px] font-medium text-teal-800 dark:bg-teal-900/60 dark:text-teal-300">
              Synonym Resolved
            </span>
          </div>
          <p className="mt-1 leading-relaxed text-teal-800 dark:text-teal-300">
            {synonym.explanation}{" "}
            <span className="font-medium text-teal-950 dark:text-teal-100">
              Showing matching FDA records for &quot;{synonym.mappedTerm}&quot;.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
