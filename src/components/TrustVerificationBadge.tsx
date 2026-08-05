import React from "react";
import { ShieldCheck, ExternalLink, Building2, Package } from "lucide-react";

interface TrustVerificationBadgeProps {
  manufacturer?: string;
  productNdc?: string;
}

export function TrustVerificationBadge({ manufacturer, productNdc }: TrustVerificationBadgeProps) {
  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-semibold tracking-tight text-slate-800 dark:text-slate-200">
            OpenFDA Verified Data Record
          </span>
        </div>
        <a
          href="https://open.fda.gov/apis/drug/label/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        >
          <span>open.fda.gov</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-400">
        {manufacturer && (
          <div className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">
              <span className="font-medium text-slate-700 dark:text-slate-300">Manufacturer:</span> {manufacturer}
            </span>
          </div>
        )}
        {productNdc && (
          <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
            <span>
              <span className="font-medium text-slate-700 dark:text-slate-300">NDC Code:</span> {productNdc}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

