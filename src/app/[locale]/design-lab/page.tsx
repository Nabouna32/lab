import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import VisualLab from "./VisualLab";

export const metadata: Metadata = {
  title: "Material 3 Visual Lab — Loculary",
  description: "An isolated experimental space to compare visual directions for Loculary.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function DesignLabPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <VisualLab initialLocale={locale} />;
}
