import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getToolPageMetadata } from "@/lib/tools/page-metadata";
import { getToolByRoute, toolRegistry } from "@/lib/tools/registry";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import ToolPage from "@/components/tools/ToolPage/ToolPage";
import RelatedTools from "@/components/tools/RelatedTools";
import ToolRenderer from "@/components/tools/ToolRenderer";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    toolRegistry.map(({ tool }) => ({
      locale,
      category: getPrimaryToolCategory(tool),
      slug: tool.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  if (!isLocale(locale)) return {};

  const entry = getToolRegistryEntryByRoute(category, slug);
  if (!entry) return {};

  return getToolPageMetadata(entry.tool, locale);
}

function getToolRegistryEntryByRoute(category: string, slug: string) {
  return getToolByRoute(category, slug);
}

export default async function ToolRoute({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale: localeParam, category, slug } = await params;
  if (!isLocale(localeParam)) notFound();

  const entry = getToolRegistryEntryByRoute(category, slug);
  if (!entry) notFound();

  const locale: Locale = localeParam;
  const { default: ToolEditorial } = await entry.module.loadEditorial();

  return (
    <ToolPage
      locale={locale}
      tool={entry.tool}
      content={
        <>
          <div className="space-y-12"><ToolEditorial locale={locale} /></div>
          <RelatedTools toolId={entry.tool.id} locale={locale} />
        </>
      }
    >
      <ToolRenderer toolId={entry.tool.id} />
    </ToolPage>
  );
}
