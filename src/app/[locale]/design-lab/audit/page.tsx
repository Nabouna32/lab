import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { requireAdminPermission } from "@/lib/admin/authorization";
import ComponentAuditWorkbench from "./ComponentAuditWorkbench";

export const metadata: Metadata = {
  title: "Material 3 Component Maintenance — Loculary",
  description: "Private, evidence-led maintenance and conformance tracking for actual Loculary UI components.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function ComponentAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdminPermission(locale, "audit.read");
  return <ComponentAuditWorkbench locale={locale} />;
}
