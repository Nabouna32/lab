import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import ComponentAuditWorkbench from "./ComponentAuditWorkbench";

export const metadata: Metadata = {
  title: "Material 3 Component Audit — Loculary",
  description: "Structured, evidence-led component-by-component Material 3 Fidelity audit.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ComponentAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ComponentAuditWorkbench locale={locale} />;
}
