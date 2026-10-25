import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InformationPage, { getInformationPageMetadata } from "@/components/information/InformationPage";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") return {};
  return getInformationPageMetadata(locale, "about");
}

export default async function FrenchAboutRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  return <InformationPage locale={locale} kind="about" />;
}
