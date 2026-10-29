import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import VisualLab from "./VisualLab";

export const metadata: Metadata = {
  title: "Material 3 Component Gallery — Loculary",
  description: "A local gallery of real shared Loculary UI components.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function DesignLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <VisualLab initialLocale={locale} />;
}
