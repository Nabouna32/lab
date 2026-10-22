import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegalNoticePage, { getLegalNoticeMetadata } from "@/components/legal/LegalNoticePage";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") return {};
  return getLegalNoticeMetadata(locale);
}

export default async function FrenchLegalNoticeRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "fr") notFound();
  return <LegalNoticePage locale={locale} />;
}
