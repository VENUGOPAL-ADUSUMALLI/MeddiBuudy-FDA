import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MedicineNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center sm:px-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Medicine not found</h1>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          We couldn&apos;t find a medicine matching that name. Try searching using a brand name (e.g.
          Dolo 650, Crocin) or generic name (e.g. Paracetamol).
        </p>
        <Link
          href="/"
          className="mt-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Back to search
        </Link>
      </main>
      <Footer />
    </>
  );
}
