import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import { getToolById, getPrimaryToolCategory, getAllTools, getToolContent } from "@/lib/tools/types";
import { getToolPath, getToolSlug, getCategoryPath, getCategorySlug, getToolsPath, getCategoriesPath } from "@/lib/tools/routes";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getToolPageMetadata } from "@/lib/tools/page-metadata";
import { getCategoryName } from "@/lib/tools/categories";
import ToolRenderer from "@/components/tools/ToolRenderer";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface ToolPageProps {
  params: Promise<{ locale: string; toolId: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  const locales = ["en", "fr"] as Locale[];
  return tools.flatMap((tool) =>
    locales.map((locale) => ({
      locale,
      toolId: getToolSlug(locale, tool.id),
    }))
  );
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { locale, toolId } = await params;
  if (!isLocale(locale)) return {};

  const tool = getToolById(locale, toolId);
  if (!tool) return {};

  return getToolPageMetadata(tool, locale);
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { locale, toolId } = await params;
  if (!isLocale(locale)) notFound();

  const tool = getToolById(locale, toolId);
  if (!tool) notFound();

  const t = getMessages(locale);
  const category = getPrimaryToolCategory(tool);

  return (
    <main className="min-h-full pt-10">
      <Breadcrumb
        items={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.tools, href: getToolsPath(locale) },
          { label: getCategoryName(locale, category), href: getCategoryPath(locale, category) },
          { label: getToolContent(tool, locale).name, href: getToolPath(locale, tool.id), current: true },
        ]}
        locale={locale}
      />

      <div className="mx-auto max-w-[var(--content-wide)] px-4 pb-10 sm:px-6 lg:px-10">
        <ToolRenderer toolId={tool.id} />
      </div>
    </main>
  );
}