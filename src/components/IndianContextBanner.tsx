import React from "react";
import { Info } from "lucide-react";
import type { SynonymMatch } from "@/lib/synonyms";

interface IndianContextBannerProps {
  synonym: SynonymMatch;
}

export function IndianContextBanner({ synonym }: IndianContextBannerProps) {
  return (
    <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs sm:text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <div className="flex items-start gap-2.5">
        <Info className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
        <div className="flex-1 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">
            Generic Name Mapping:
          </span>{" "}
          {synonym.explanation}{" "}
          <span className="font-medium text-slate-900 dark:text-white">
            Showing FDA results for &quot;{synonym.mappedTerm}&quot;.
          </span>
        </div>
      </div>
    </div>
  );
}

