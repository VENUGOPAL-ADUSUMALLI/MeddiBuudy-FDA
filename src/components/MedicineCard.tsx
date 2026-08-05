import Link from "next/link";
import { Pill, Droplets, Syringe, Eye, ChevronRight, Sparkles } from "lucide-react";
import type { MedicineSummary } from "@/types/medicine";

const ROUTE_CONFIG: Record<
  string,
  { icon: typeof Pill; color: string; bg: string; badge: string }
> = {
  ORAL: {
    icon: Pill,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
  },
  TOPICAL: {
    icon: Droplets,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/60",
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300",
  },
  INJECTION: {
    icon: Syringe,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
  },
  OPHTHALMIC: {
    icon: Eye,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
  },
};

export function MedicineCard({ medicine }: { medicine: MedicineSummary }) {
  const href = `/medicine/${medicine.slug}?q=${encodeURIComponent(medicine.brandName)}`;
  const formKey = medicine.dosageForm ? medicine.dosageForm.toUpperCase() : "ORAL";

  // Find matching route config or default to ORAL
  const matchedKey = Object.keys(ROUTE_CONFIG).find((k) => formKey.includes(k)) || "ORAL";
  const config = ROUTE_CONFIG[matchedKey];
  const RouteIcon = config.icon;

  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 p-4 transition-all duration-200 hover:bg-teal-50/80 focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800/80"
    >
      {/* Dosage Form Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.bg} shadow-2xs transition-transform duration-200 group-hover:scale-105`}
      >
        <RouteIcon className={`h-5 w-5 ${config.color}`} aria-hidden />
      </div>

      {/* Main Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-bold tracking-tight text-slate-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-400">
            {medicine.brandName}
          </h3>
          {medicine.dosageForm && (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${config.badge}`}
            >
              {medicine.dosageForm}
            </span>
          )}
        </div>

        {medicine.genericName && (
          <p className="mt-0.5 truncate text-sm font-medium text-slate-600 dark:text-slate-300">
            {medicine.genericName}
          </p>
        )}

        {medicine.purpose && (
          <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Purpose:</span>{" "}
            {medicine.purpose}
          </p>
        )}
      </div>

      {/* Action Chevron */}
      <div className="flex items-center gap-1 shrink-0 text-slate-400 group-hover:text-teal-600 dark:text-slate-500 dark:group-hover:text-teal-400">
        <span className="hidden text-xs font-semibold sm:inline opacity-0 transition-opacity group-hover:opacity-100">
          View Label
        </span>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
