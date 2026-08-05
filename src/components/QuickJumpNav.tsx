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
      className="sticky top-14 z-30 flex gap-4 overflow-x-auto border-b border-slate-200 bg-white/90 py-2.5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="shrink-0 text-xs font-medium text-slate-600 transition-colors hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}

