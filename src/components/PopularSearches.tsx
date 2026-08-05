const POPULAR_SEARCHES = [
  "Dolo 650",
  "Paracetamol",
  "Tylenol",
  "Advil",
  "Crocin",
  "Ibuprofen",
  "Meftal",
  "Gelusil",
];

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
      <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-teal-200/70" : "text-slate-500 dark:text-slate-400"}`}>
        Popular Searches:
      </span>
      {POPULAR_SEARCHES.map((term) => (
        <button
          key={term}
          type="button"
          onClick={() => onPick(term)}
          className={
            isDark
              ? "rounded-full border border-teal-700/60 bg-teal-900/60 px-3 py-1 text-xs font-medium text-teal-200 shadow-2xs transition-all hover:scale-105 hover:border-teal-500 hover:bg-teal-900 hover:text-white"
              : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs transition-all hover:scale-105 hover:border-teal-500 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
          }
        >
          {term}
        </button>
      ))}
    </div>
  );
}
