import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionsView, { type CollectionTool } from "@/components/collections/CollectionsView";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolContent } from "@/lib/tools/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getToolPath } from "@/lib/tools/routes";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  if (!isLocale(value)) notFound();
  const locale: Locale = value;
  const tools: CollectionTool[] = getPublishedTools().map((tool) => {
    const content = getToolContent(tool, locale);
    return { id: tool.id, icon: tool.icon, name: content.name, description: content.description, href: getToolPath(locale, tool.id) };
  });
  return <CollectionsView locale={locale} tools={tools} />;
}
