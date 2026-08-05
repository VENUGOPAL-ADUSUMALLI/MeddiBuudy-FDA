import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1.5" aria-label="Medicine Directory home">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Medicine
          </span>
          <span className="text-base font-bold tracking-tight text-teal-600 dark:text-teal-400">
            Directory
          </span>
        </Link>
        <span className="hidden text-xs font-medium text-slate-400 sm:inline dark:text-slate-500">
          FDA drug label lookup
        </span>
      </div>
    </header>
  );
}
