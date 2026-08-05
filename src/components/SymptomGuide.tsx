import { Info } from "lucide-react";
import Link from "next/link";
import type { MedicineSummary } from "@/types/medicine";

export function SymptomGuide({ medicines, query }: { medicines: MedicineSummary[]; query: string }) {
  if (medicines.length === 0) return null;

  return (
    <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-4 dark:border-teal-900 dark:bg-teal-950/20">
      <div className="flex items-start gap-2">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-700 dark:text-teal-400" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-teal-900 dark:text-teal-300">
            No medicine named &ldquo;{query}&rdquo; — but here&apos;s a keyword match
          </p>
          <p className="mt-1 text-sm leading-relaxed text-teal-800/80 dark:text-teal-400/80">
            These are FDA-labeled medicines whose stated purpose mentions &ldquo;{query}&rdquo; — a
            plain text match, not a recommendation. Always consult a doctor or pharmacist before
            choosing a medicine.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-col divide-y divide-teal-200/60 overflow-hidden rounded-lg border border-teal-200/60 bg-white dark:divide-teal-900/50 dark:border-teal-900/50 dark:bg-slate-900">
        {medicines.map((medicine) => (
          <Link
            key={medicine.slug}
            href={`/medicine/${medicine.slug}?q=${encodeURIComponent(medicine.brandName)}`}
            className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-teal-50/60 dark:hover:bg-slate-800/60"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {medicine.brandName}
              </p>
              {medicine.purpose && (
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{medicine.purpose}</p>
              )}
            </div>
            <span className="flex-shrink-0 text-xs font-medium text-teal-600 dark:text-teal-400">
              View →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
