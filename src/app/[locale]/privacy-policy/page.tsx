import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PrivacyPolicyPage, { getPrivacyPolicyMetadata } from "@/components/legal/PrivacyPolicyPage";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") return {};
  return getPrivacyPolicyMetadata(locale);
}

export default async function EnglishPrivacyPolicyRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  return <PrivacyPolicyPage locale={locale} />;
}
