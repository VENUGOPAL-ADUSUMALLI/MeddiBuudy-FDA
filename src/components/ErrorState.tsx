import { AlertCircle, RefreshCw, SearchX } from "lucide-react";
import { PopularSearches } from "@/components/PopularSearches";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/30"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
        <p className="text-sm font-medium text-rose-900 dark:text-rose-200">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-rose-600 dark:bg-rose-500 dark:hover:bg-rose-600"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  query,
  onPickSuggestion,
}: {
  query: string;
  onPickSuggestion: (term: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
        <SearchX className="h-6 w-6" />
      </div>
      <div className="max-w-md">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          No medicines found for &ldquo;{query}&rdquo;
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Try searching by brand name (e.g. <strong className="text-slate-800 dark:text-slate-200">Dolo 650</strong>, <strong className="text-slate-800 dark:text-slate-200">Crocin</strong>, <strong className="text-slate-800 dark:text-slate-200">Tylenol</strong>) or generic name (e.g. <strong className="text-slate-800 dark:text-slate-200">Paracetamol</strong>, <strong className="text-slate-800 dark:text-slate-200">Ibuprofen</strong>).
        </p>
      </div>
      <div className="mt-1">
        <PopularSearches onPick={onPickSuggestion} variant="light" />
      </div>
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex flex-col gap-3 py-2" role="status" aria-label="Loading search results">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800/80 dark:bg-slate-900"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
