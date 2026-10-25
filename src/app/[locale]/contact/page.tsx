import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InformationPage, { getInformationPageMetadata } from "@/components/information/InformationPage";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return getInformationPageMetadata(locale, "contact");
}

export default async function ContactRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <InformationPage locale={locale} kind="contact" />;
}
