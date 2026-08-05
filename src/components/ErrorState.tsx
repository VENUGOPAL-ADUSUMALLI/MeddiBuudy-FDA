import { Loader2 } from "lucide-react";
import { PopularSearches } from "@/components/PopularSearches";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-2 rounded-lg border-l-4 border-red-500 bg-red-50 px-4 py-3.5 dark:bg-red-950/20"
    >
      <p className="text-sm font-medium text-red-800 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-red-700 underline underline-offset-2 hover:text-red-900 dark:text-red-300 dark:hover:text-red-100"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ query, onPickSuggestion }: { query: string; onPickSuggestion: (term: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center dark:border-slate-700">
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No medicines were found for &ldquo;{query}&rdquo;.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Try searching using a medicine&apos;s brand name (e.g. Dolo 650, Crocin) or generic name (e.g.
          Paracetamol). openFDA covers US-approved drugs, so a working example is:
        </p>
      </div>
      <PopularSearches onPick={onPickSuggestion} variant="light" />
    </div>
  );
}

export function LoadingState() {
  return (
    <div
      className="flex items-center gap-2 py-6 text-sm text-slate-500 dark:text-slate-400"
      role="status"
    >
      <Loader2 className="h-4 w-4 animate-spin text-teal-600 dark:text-teal-400" aria-hidden />
      Searching…
    </div>
  );
}
