import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import ToolCard from "@/components/tools/ToolCard";
import { categories, getCategoryName } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/catalog";
import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { locales, type Locale } from "@/lib/i18n/config";
import { getCategoryIdBySlug, getCategoryPath, getCategorySlug, getToolsPath } from "@/lib/tools/routes";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories
      .filter((category) => getToolsByCategory(category.id).length > 0)
      .map((category) => ({
        locale,
        section: getToolsPath(locale).split("/")[2],
        category: getCategorySlug(locale, category.id),
      })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string; category: string }> }): Promise<Metadata> {
  const { locale: localeParam, section, category: categorySlug } = await params;
  if (!locales.includes(localeParam as Locale)) return {};
  const locale = localeParam as Locale;
  if (section !== getToolsPath(locale).split("/")[2]) return {};
  const categoryId = getCategoryIdBySlug(locale, categorySlug);
  const category = categories.find((item) => item.id === categoryId);
  if (!category || getToolsByCategory(category.id).length === 0) return {};
  const categoryName = getCategoryName(locale, category.id);
  const t = getMessages(locale);
  return getPublicPageMetadata({
    title: `${categoryName} — Loculary`,
    description: t.tools.categoryDescription(categoryName),
    path: getCategoryPath(locale, category.id),
    alternatePaths: Object.fromEntries(locales.map((availableLocale) => [availableLocale, getCategoryPath(availableLocale, category.id)])),
  }, locale);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; section: string; category: string }>;
}) {
  const { locale: localeParam, section, category: categorySlug } = await params;
  if (!locales.includes(localeParam as Locale)) notFound();
  const locale = localeParam as Locale;
  if (section !== getToolsPath(locale).split("/")[2]) notFound();
  const categoryId = getCategoryIdBySlug(locale, categorySlug);
  const category = categories.find((item) => item.id === categoryId);
  if (!category || getToolsByCategory(category.id).length === 0) notFound();

  const t = getMessages(locale);
  const categoryName = getCategoryName(locale, category.id);
  const categoryTools = getToolsByCategory(category.id);

  return (
    <main className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: getToolsPath(locale) }, { label: categoryName }]} />
      <header className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
        <div className="relative flex items-start gap-4 motion-reveal">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--accent)]/20 bg-[var(--accent-soft)] text-2xl shadow-[var(--shadow-sm)]" aria-hidden="true">{category.icon}</span>
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

function formatCategoryCount(locale: Locale, count: number, one: string, many: string) {
  return new Intl.PluralRules(locale).select(count) === "one" ? one : many;
}
