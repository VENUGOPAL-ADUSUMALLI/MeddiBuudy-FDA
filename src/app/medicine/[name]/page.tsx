import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMedicineByBrandName } from "@/lib/openfda";
import { slugToSearchTerm } from "@/lib/slug";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DetailField } from "@/components/DetailField";
import { Disclaimer } from "@/components/Disclaimer";
import { QuickJumpNav } from "@/components/QuickJumpNav";

interface PageProps {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ q?: string }>;
}

async function resolveMedicine(slug: string, q?: string) {
  const searchTerm = q?.trim() || slugToSearchTerm(slug);
  return getMedicineByBrandName(searchTerm, slug);
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const { q } = await searchParams;
  const result = await resolveMedicine(name, q);

  if (result.kind === "not-found") {
    return { title: "Medicine not found" };
  }

  const { medicine } = result;
  const description = medicine.purpose
    ? `${medicine.brandName}: ${medicine.purpose}`
    : `FDA label information for ${medicine.brandName}, including active ingredients, warnings, and dosage.`;

  return {
    title: medicine.brandName,
    description,
    alternates: {
      canonical: `/medicine/${medicine.slug}`,
    },
  };
}

export default async function MedicineDetailsPage({ params, searchParams }: PageProps) {
  const { name } = await params;
  const { q } = await searchParams;
  const result = await resolveMedicine(name, q);

  if (result.kind === "not-found") {
    notFound();
  }

  const { medicine } = result;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex flex-col gap-4 py-6">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to search
          </Link>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {medicine.brandName}
            </h1>
            {medicine.genericName && (
              <p className="mt-1 text-sm font-medium text-teal-700 dark:text-teal-400">
                {medicine.genericName}
              </p>
            )}
          </div>
        </div>

        <QuickJumpNav />

        <div className="flex flex-col gap-5 py-6">
          {/* Ingredients + Purpose are typically short — a compact side-by-side
              summary keeps them from pushing the longer Dosage/Warnings content down. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div id="ingredients" className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Active Ingredients
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {medicine.activeIngredients || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Active ingredient information is not available.
                  </span>
                )}
              </p>
            </div>
            <div id="purpose" className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Purpose
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {medicine.purpose || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Purpose information is not available.
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <DetailField
              id="dosage"
              label="Dosage & Administration"
              value={medicine.dosageAndAdministration}
              unavailableText="Dosage information is not available."
            />
            <DetailField
              id="warnings"
              accordion
              label="Warnings"
              value={medicine.warnings}
              unavailableText="Warning information is not available."
            />
          </div>

          <Disclaimer />
        </div>
      </main>
      <Footer />
    </>
  );
}
