import Link from "next/link";
import { Pill } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95 print:hidden">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-900 dark:text-white transition-opacity hover:opacity-90"
          aria-label="Medibuddy Medicine Directory home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white dark:bg-teal-500">
            <Pill className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Medibuddy
            </span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Drug Directory
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            openFDA Connected
          </span>
        </div>
      </div>
    </header>
  );
}

