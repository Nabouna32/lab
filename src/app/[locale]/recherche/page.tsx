import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchResultsPage, { getSearchResultsMetadata } from "@/components/tools/SearchResultsPage";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  return locale === "fr" ? getSearchResultsMetadata("fr") : {};
}

export default async function FrenchSearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  if (locale !== "fr") notFound();
  return <SearchResultsPage locale="fr" />;
}
