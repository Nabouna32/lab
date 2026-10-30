import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import ToolPage from "@/components/tools/ToolPage/ToolPage";
import NextActions from "@/components/tools/RelatedTools";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { categories, getCategoryContainerColor, getCategoryOnContainerColor, getCategoryName } from "@/lib/tools/categories";
import { getCategorySeoDescription, isCategorySeoIndexable } from "@/lib/seo/category-policy";
import { getToolsByCategory } from "@/lib/tools/catalog";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata, getToolPageMetadata } from "@/lib/tools/page-metadata";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import {
  getCategoriesPath,
  getCategoryIdBySlug,
  getCategoryPath,
  getCategorySlug,
  getToolSlug,
  getToolsPath,
} from "@/lib/tools/routes";
import { getToolByRoute, toolRegistry } from "@/lib/tools/registry";

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    ...categories
      .filter((category) => getToolsByCategory(category.id).length > 0)
      .map((category) => ({
        locale,
        section: getCategoriesPath(locale).split("/")[2],
        slug: getCategorySlug(locale, category.id),
      })),
    ...toolRegistry.map(({ tool }) => ({
      locale,
      section: getToolsPath(locale).split("/")[2],
      slug: getToolSlug(locale, tool.id),
    })),
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, section, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale: Locale = localeParam;

  if (section === getCategoriesPath(locale).split("/")[2]) {
    const categoryId = getCategoryIdBySlug(locale, slug);
    const category = categories.find((item) => item.id === categoryId);
    if (!category || getToolsByCategory(category.id).length === 0) return {};
    const categoryName = getCategoryName(locale, category.id);
    const metadata = getPublicPageMetadata({
      title: `${categoryName} — Loculary`,
      description: getCategorySeoDescription(locale, category.id),
      path: getCategoryPath(locale, category.id),
    }, locale);
    return isCategorySeoIndexable(category.id)
      ? metadata
      : { ...metadata, robots: { index: false, follow: true } };
  }

  if (section === getToolsPath(locale).split("/")[2]) {
    const entry = getToolByRoute(locale, slug);
    return entry ? getToolPageMetadata(entry.tool, locale) : {};
  }

  return {};
}

export default async function LocalizedToolOrCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; section: string; slug: string }>;
}) {
  const { locale: localeParam, section, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale: Locale = localeParam;

  if (section === getCategoriesPath(locale).split("/")[2]) {
    const categoryId = getCategoryIdBySlug(locale, slug);
    const category = categories.find((item) => item.id === categoryId);
    if (!category) notFound();

    const categoryTools = getToolsByCategory(category.id);
    if (categoryTools.length === 0) notFound();

    const t = getMessages(locale);
    const categoryName = getCategoryName(locale, category.id);

    return (
      <main>
      <div className="mx-auto w-full max-w-[var(--layout-content-wide)] px-[var(--layout-page-gutter)] py-[var(--space-8)] sm:py-[var(--space-10)]">
        <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: getToolsPath(locale) }, { label: categoryName }]} />
        <header className="border-b border-[var(--border)] pb-[var(--space-7)] pt-[var(--space-7)] sm:pb-[var(--space-9)]">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)]" style={{ backgroundColor: getCategoryContainerColor(category.id), color: getCategoryOnContainerColor(category.id) }} aria-hidden="true"><MaterialIcon name={category.icon} size={24} /></span>
            <div className="min-w-0 max-w-3xl">
              <h1 className="m3-type-headline-large">{categoryName}</h1>
              <p className="m3-type-body-large mt-[var(--space-2)] text-[var(--muted)]">{getCategorySeoDescription(locale, category.id)}</p>
            </div>
          </div>
        </header>
        <section className="py-[var(--space-7)] sm:py-[var(--space-9)]" aria-labelledby="category-tools-heading">
          <div className="mb-[var(--space-4)]">
            <h2 id="category-tools-heading" className="m3-type-title-large">
              {categoryTools.length} {formatCategoryCount(locale, categoryTools.length, t.tools.one, t.tools.many)}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} categoryName={categoryName} categoryId={category.id} />)}
          </div>
        </section>
        </div>
    </main>
    );
  }

  if (section === getToolsPath(locale).split("/")[2]) {
    const entry = getToolByRoute(locale, slug);
    if (!entry) notFound();

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

  notFound();
}

function formatCategoryCount(locale: Locale, count: number, one: string, many: string) {
  return new Intl.PluralRules(locale).select(count) === "one" ? one : many;
}
