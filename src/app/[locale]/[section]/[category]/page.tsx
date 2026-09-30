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
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: getToolsPath(locale) }, { label: categoryName }]} />
        <p className="mt-8 text-3xl" aria-hidden="true">{category.icon}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">{categoryName}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{t.tools.categoryDescription(categoryName)}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} categoryName={categoryName} />)}
      </div>
    </main>
  );
}
