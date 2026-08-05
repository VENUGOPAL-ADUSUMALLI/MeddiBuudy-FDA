import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomeSearch } from "@/components/HomeSearch";

export const metadata: Metadata = {
  title: "Medicine Directory — Search FDA Drug Labels",
  description:
    "Search medicines by brand or generic name and view FDA label information: active ingredients, purpose, warnings, and dosage.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <HomeSearch />
      </main>
      <Footer />
    </>
  );
}
