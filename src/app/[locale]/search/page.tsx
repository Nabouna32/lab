import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SearchResultsPage, { getSearchResultsMetadata } from "@/components/tools/SearchResultsPage";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  return locale === "en" ? getSearchResultsMetadata("en") : {};
}

export default async function EnglishSearchPage({ params }: SearchPageProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <SearchResultsPage locale="en" />;
}
