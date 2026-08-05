const POPULAR_SEARCHES = ["Tylenol", "Advil", "Motrin", "Ibuprofen", "Aspirin", "Acetaminophen"];

export function PopularSearches({
  onPick,
  variant = "dark",
}: {
  onPick: (term: string) => void;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`text-xs font-medium ${isDark ? "text-teal-200/60" : "text-slate-500 dark:text-slate-400"}`}>
        Try:
      </span>
      {POPULAR_SEARCHES.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onPick(term)}
          className={
            isDark
              ? "rounded-full border border-teal-800 bg-teal-900/60 px-3 py-1 text-xs font-medium text-teal-200 transition-colors hover:border-teal-600 hover:bg-teal-900 hover:text-white"
              : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
          }
        >
          {term}
        </button>
      ))}
    </div>
  );
}
