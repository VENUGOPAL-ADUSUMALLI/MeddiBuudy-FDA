import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pill, ShieldCheck } from "lucide-react";
import { getMedicineByBrandName } from "@/lib/openfda";
import { slugToSearchTerm } from "@/lib/slug";
import { getDrugSynonym } from "@/lib/synonyms";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DetailField } from "@/components/DetailField";
import { Disclaimer } from "@/components/Disclaimer";
import { QuickJumpNav } from "@/components/QuickJumpNav";
import { PrintShareActions } from "@/components/PrintShareActions";
import { TrustVerificationBadge } from "@/components/TrustVerificationBadge";
import { IndianContextBanner } from "@/components/IndianContextBanner";

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
    return {
      title: "Medicine Not Found | Medibuddy",
      description: "The requested medicine could not be found in the openFDA database.",
    };
  }

  const { medicine } = result;
  const pageTitle = `${medicine.brandName} ${medicine.genericName ? `(${medicine.genericName})` : ""} - FDA Label & Dosage`;
  const description = medicine.purpose
    ? `${medicine.brandName} (${medicine.genericName || "Drug"}): ${medicine.purpose}. View active ingredients, dosage, and warnings.`
    : `Official FDA drug label details for ${medicine.brandName}, including active ingredients, dosage instructions, and warnings.`;
  const canonicalUrl = `https://medibuddy.fda.gov/medicine/${medicine.slug}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: "Medibuddy Medicine Directory",
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description,
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
  const synonym = getDrugSynonym(q || name);

  // JSON-LD Structured Data for schema.org/Drug
  const jsonLdDrug = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: medicine.brandName,
    nonProprietaryName: medicine.genericName || undefined,
    activeIngredient: medicine.activeIngredients || undefined,
    dosageForm: medicine.dosageForm || undefined,
    administrationRoute: medicine.dosageForm || undefined,
    warning: medicine.warnings || undefined,
    description: medicine.purpose || undefined,
    manufacturer: medicine.manufacturer ? { "@type": "Organization", name: medicine.manufacturer } : undefined,
  };

  // JSON-LD Breadcrumb Schema
  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://medibuddy.fda.gov/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: medicine.brandName,
        item: `https://medibuddy.fda.gov/medicine/${medicine.slug}`,
      },
    ],
  };

  return (
    <>
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDrug) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <Header />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6 py-6">
        {/* Navigation & Header Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>Back to Search</span>
          </Link>

          <PrintShareActions brandName={medicine.brandName} genericName={medicine.genericName} />
        </div>

        {/* Indian User Context Banner */}
        {synonym && <IndianContextBanner synonym={synonym} />}

        {/* Hero Card Header */}
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/50 to-teal-50/30 p-6 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-teal-950/20 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-xs dark:bg-teal-500">
              <Pill className="h-6 w-6 rotate-45" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                  {medicine.brandName}
                </h1>
                {medicine.dosageForm && (
                  <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-teal-800 dark:bg-teal-900/80 dark:text-teal-200">
                    {medicine.dosageForm}
                  </span>
                )}
              </div>

              {medicine.genericName && (
                <p className="mt-1 text-base font-semibold text-teal-700 dark:text-teal-400">
                  Generic: {medicine.genericName}
                </p>
              )}

              {medicine.manufacturer && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Manufactured by: <strong className="text-slate-700 dark:text-slate-300">{medicine.manufacturer}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        <QuickJumpNav />

        <div className="flex flex-col gap-6 py-4">
          {/* Active Ingredients & Purpose Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div id="ingredients" className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Ingredients
              </h2>
              <p className="mt-2 text-sm leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                {medicine.activeIngredients || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Active ingredient information is not available.
                  </span>
                )}
              </p>
            </div>

            <div id="purpose" className="scroll-mt-28 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Purpose
              </h2>
              <p className="mt-2 text-sm leading-relaxed font-medium text-slate-800 dark:text-slate-200">
                {medicine.purpose || (
                  <span className="italic text-slate-400 dark:text-slate-500">
                    Purpose information is not available.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Dosage & Accordion Warnings */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <DetailField
              id="dosage"
              label="Dosage & Directions"
              value={medicine.dosageAndAdministration}
              unavailableText="Dosage information is not available."
            />
            <DetailField
              id="warnings"
              accordion
              label="Warnings & Precautions"
              value={medicine.warnings}
              unavailableText="Warning information is not available."
            />
          </div>

          {/* Verified Source & Helpline Badge */}
          <TrustVerificationBadge manufacturer={medicine.manufacturer} productNdc={medicine.productNdc} />

          {/* Health Disclaimer */}
          <Disclaimer />
        </div>
      </main>
      <Footer />
    </>
  );
}
