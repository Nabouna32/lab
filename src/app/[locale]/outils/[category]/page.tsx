import type { Metadata } from "next";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import ToolCard from "@/components/tools/ToolCard";
import { categories, getCategoryName } from "@/lib/tools/categories";
import { getToolsByCategory } from "@/lib/tools/catalog";

import { getMessages } from "@/lib/i18n/messages";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { locales, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    categories
      .filter((category) =>
        getToolsByCategory(category.id).length > 0,
      )
      .map((category) => ({ locale, category: category.id })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale: localeParam, category: categoryId } = await params;
  if (!locales.includes(localeParam as Locale)) return {};
  const category = categories.find((item) => item.id === categoryId);
  if (!category || getToolsByCategory(categoryId).length === 0) return {};
  const locale = localeParam as Locale;
  const categoryName = getCategoryName(locale, categoryId);
  const t = getMessages(locale);
  return getPublicPageMetadata({
    title: `${categoryName} — Utiluna`,
    description: `${t.tools.categoryDescription} ${categoryName.toLowerCase()}.`,
    path: `/${locale}/outils/${categoryId}`,
  }, locale);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: localeParam, category: categoryId } = await params;
  const locale = localeParam as Locale;
  const category = categories.find((item) => item.id === categoryId);
  const categoryTools = getToolsByCategory(categoryId);

  if (!category || categoryTools.length === 0 || !locales.includes(locale)) {
    notFound();
  }

  const t = getMessages(locale);
  const categoryName = getCategoryName(locale, categoryId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <Breadcrumbs locale={locale} items={[{ label: t.nav.tools, href: `/${locale}/outils` }, { label: categoryName }]} />

        <p className="mt-8 text-3xl" aria-hidden="true">
          {category.icon}
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {categoryName}
        </h1>

        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          {t.tools.categoryDescription} {categoryName.toLowerCase()}.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} categoryName={categoryName} />
        ))}
      </div>
    </main>
  );
}
