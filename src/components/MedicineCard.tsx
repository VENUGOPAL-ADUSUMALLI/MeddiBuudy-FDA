import Link from "next/link";
import { Pill, Droplet, Syringe, ChevronRight } from "lucide-react";
import type { MedicineSummary } from "@/types/medicine";

const ROUTE_ICON: Record<string, typeof Pill> = {
  ORAL: Pill,
  TOPICAL: Droplet,
  INJECTION: Syringe,
};

export function MedicineCard({ medicine }: { medicine: MedicineSummary }) {
  const href = `/medicine/${medicine.slug}?q=${encodeURIComponent(medicine.brandName)}`;
  const RouteIcon = (medicine.dosageForm && ROUTE_ICON[medicine.dosageForm.toUpperCase()]) || Pill;

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-teal-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 dark:hover:bg-slate-800/60"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/50">
        <RouteIcon className="h-4 w-4 text-teal-600 dark:text-teal-400" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-900 dark:text-white">{medicine.brandName}</p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-slate-500 dark:text-slate-400">
          {medicine.genericName && <span className="truncate">{medicine.genericName}</span>}
          {medicine.genericName && medicine.dosageForm && <span aria-hidden>·</span>}
          {medicine.dosageForm && (
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {medicine.dosageForm}
            </span>
          )}
        </div>
      </div>

      <ChevronRight
        className="h-4 w-4 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-500 dark:text-slate-600"
        aria-hidden
      />
    </Link>
  );
}
