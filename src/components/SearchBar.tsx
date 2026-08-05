import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <label htmlFor="medicine-search" className="sr-only">
        Search medicines by brand or generic name
      </label>
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-lg ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-teal-500 dark:bg-slate-900 dark:ring-white/10">
        <Search className="h-5 w-5 flex-shrink-0 text-slate-400" aria-hidden />
        <input
          id="medicine-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder="Try Tylenol, Ibuprofen, Aspirin…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
