import React from "react";
import { ShieldCheck, PhoneCall, ExternalLink, Building2, Package } from "lucide-react";

interface TrustVerificationBadgeProps {
  manufacturer?: string;
  productNdc?: string;
}

export function TrustVerificationBadge({ manufacturer, productNdc }: TrustVerificationBadgeProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
            Official openFDA Verified Record
          </span>
        </div>
        <a
          href="https://open.fda.gov/apis/drug/label/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
        >
          <span>open.fda.gov API</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs text-slate-600 dark:text-slate-400">
        {manufacturer && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">
              <strong>Manufacturer:</strong> {manufacturer}
            </span>
          </div>
        )}
        {productNdc && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            <span>
              <strong>US National Drug Code (NDC):</strong> {productNdc}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-lg bg-rose-50/80 p-2.5 text-xs text-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
        <div className="flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>In case of emergency or overdose in India:</span>
        </div>
        <span className="font-bold text-rose-700 dark:text-rose-300 shrink-0">
          Dial 108 / National Poison Helpline 1800-11-6117
        </span>
      </div>
    </div>
  );
}
