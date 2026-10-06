import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getToolPageMetadata } from "@/lib/tools/page-metadata";
import { getToolByRoute, toolRegistry } from "@/lib/tools/registry";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import { getCategorySlug, getToolSlug, getToolsPath } from "@/lib/tools/routes";
import ToolPage from "@/components/tools/ToolPage/ToolPage";
import NextActions from "@/components/tools/RelatedTools";
import ToolRenderer from "@/components/tools/ToolRenderer";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    toolRegistry.map(({ tool }) => ({
      locale,
      section: getToolsPath(locale).split("/")[2],
      category: getCategorySlug(locale, getPrimaryToolCategory(tool)),
      slug: getToolSlug(locale, tool.id),
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; category: string; slug: string }>;
}) {
  const { locale, section, category, slug } = await params;
  if (!isLocale(locale) || section !== getToolsPath(locale).split("/")[2]) return {};
  const entry = getToolByRoute(locale, category, slug);
  if (!entry) return {};
  return getToolPageMetadata(entry.tool, locale);
}

export default async function ToolRoute({
  params,
}: {
  params: Promise<{ locale: string; section: string; category: string; slug: string }>;
}) {
  const { locale: localeParam, section, category, slug } = await params;
  if (!isLocale(localeParam) || section !== getToolsPath(localeParam).split("/")[2]) notFound();

  const entry = getToolByRoute(localeParam, category, slug);
  if (!entry) notFound();

  const locale: Locale = localeParam;
  const { default: ToolEditorial } = await entry.module.loadEditorial();

  return (
    <ToolPage
      locale={locale}
      tool={entry.tool}
      content={<div className="space-y-12"><ToolEditorial locale={locale} /></div>}
    >
      <ToolRenderer toolId={entry.tool.id} />
      <div className="mt-8">
        <NextActions toolId={entry.tool.id} locale={locale} />
      </div>
    </ToolPage>
  );
}
