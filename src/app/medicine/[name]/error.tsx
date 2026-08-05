"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MedicineDetailsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">We couldn&apos;t load this medicine</h1>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          There was a problem reaching the medicine database. Please check your connection and try again.
        </p>
        <div className="mt-2 flex gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            Back to search
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
