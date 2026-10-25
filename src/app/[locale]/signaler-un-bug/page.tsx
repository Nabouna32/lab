import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InformationPage from "@/components/information/InformationPage";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Signaler un bug | Loculary", robots: { index: false, follow: false } };
}

export default async function FrenchBugReportRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  return <InformationPage locale={locale} kind="bugReport" />;
}
