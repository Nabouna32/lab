import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ToolCard from "@/components/tools/ToolCard";
import ToolPage from "@/components/tools/ToolPage/ToolPage";
import NextActions from "@/components/tools/RelatedTools";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { categories, getCategoryName } from "@/lib/tools/categories";
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
    const t = getMessages(locale);
    return getPublicPageMetadata({
      title: `${categoryName} — Loculary`,
      description: t.tools.categoryDescription(categoryName),
      path: getCategoryPath(locale, category.id),
      alternatePaths: Object.fromEntries(
        locales.map((availableLocale) => [
          availableLocale,
          getCategoryPath(availableLocale, category.id),
        ]),
      ),
    }, locale);
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: getToolsPath(locale) }, { label: categoryName }]} />
        <header className="border-b border-[var(--border)] pb-7 pt-7 sm:pb-9">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-2xl" aria-hidden="true">{category.icon}</span>
            <div className="min-w-0 max-w-3xl">
              <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">{categoryName}</h1>
              <p className="mt-2 text-base leading-7 text-[var(--muted)]">{t.tools.categoryDescription(categoryName)}</p>
            </div>
          </div>
        </header>
        <section className="py-7 sm:py-9" aria-labelledby="category-tools-heading">
          <div className="mb-4">
            <h2 id="category-tools-heading" className="text-lg font-bold sm:text-xl">
              {categoryTools.length} {formatCategoryCount(locale, categoryTools.length, t.tools.one, t.tools.many)}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} categoryName={categoryName} />)}
          </div>
        </section>
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
