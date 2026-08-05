const SECTIONS = [
  { id: "ingredients", label: "Ingredients" },
  { id: "purpose", label: "Purpose" },
  { id: "dosage", label: "Dosage" },
  { id: "warnings", label: "Warnings" },
];

export function QuickJumpNav() {
  return (
    <nav
      aria-label="Jump to section"
      className="sticky top-14 z-40 -mx-4 flex gap-1.5 overflow-x-auto border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 dark:border-slate-800 dark:bg-slate-950/95"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="flex-shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-teal-600 dark:hover:text-teal-400"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
