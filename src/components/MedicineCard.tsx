import Link from "next/link";
import { Pill, ChevronRight } from "lucide-react";
import type { MedicineSummary } from "@/types/medicine";

export function MedicineCard({ medicine }: { medicine: MedicineSummary }) {
  const href = `/medicine/${medicine.slug}?q=${encodeURIComponent(medicine.brandName)}`;

  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3.5 p-4 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800/60"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Pill className="h-5 w-5" aria-hidden />
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-400">
            {medicine.brandName}
          </h3>
          {medicine.dosageForm && (
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {medicine.dosageForm}
            </span>
          )}
        </div>

        {medicine.genericName && (
          <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">
            <span className="font-normal text-slate-500">Generic:</span> {medicine.genericName}
          </p>
        )}

        {medicine.purpose && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
            {medicine.purpose}
          </p>
        )}
      </div>

      {/* Action Chevron */}
      <div className="flex items-center shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

