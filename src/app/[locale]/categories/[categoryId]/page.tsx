import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages } from "@/lib/i18n/messages";
import { getCategoryName, getCategoryTools, getAllCategories } from "@/lib/tools/categories";
import { getCategoryPath, getCategorySlug, getToolsPath, getToolPath, getCategoriesPath } from "@/lib/tools/routes";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import ToolCard from "@/components/tools/ToolCard";
import Breadcrumb from "@/components/layout/Breadcrumb";

interface CategoryPageProps {
  params: Promise<{ locale: string; categoryId: string }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  const locales = ["en", "fr"] as Locale[];
  return categories.flatMap((cat) =>
    locales.map((locale) => ({
      locale,
      categoryId: getCategorySlug(locale, cat.id),
    }))
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, categoryId } = await params;
  if (!isLocale(locale)) return {};

  const category = getAllCategories().find((c) => getCategorySlug(locale, c.id) === categoryId);
  if (!category) return {};

  return getPublicPageMetadata({
    title: getCategoryName(locale, category.id),
    description: `Explorez les outils de la catégorie ${getCategoryName(locale, category.id)} sur Loculary.`,
    path: getCategoryPath(locale, category.id),
  }, locale);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, categoryId } = await params;
  if (!isLocale(locale)) notFound();

  const category = getAllCategories().find((c) => getCategorySlug(locale, c.id) === categoryId);
  if (!category) notFound();

  const t = getMessages(locale);
  const tools = getCategoryTools(category.id);

  return (
    <main className="min-h-full pt-10">
      <Breadcrumb
        items={[
          { label: t.nav.home, href: `/${locale}` },
          { label: t.nav.tools, href: getToolsPath(locale) },
          { label: getCategoryName(locale, category.id), href: getCategoryPath(locale, category.id), current: true },
        ]}
        locale={locale}
      />

      <div className="mx-auto max-w-[var(--content-wide)] px-4 pb-10 sm:px-6 lg:px-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {getCategoryName(locale, category.id)}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            {tools.length} {tools.length === 1 ? t.tools.one : t.tools.many}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              locale={locale}
              categoryName={getCategoryName(locale, category.id)}
              categoryId={category.id}
            />
          ))}
        </div>

        {tools.length === 0 && (
          <div className="text-center py-12 text-[var(--muted)]">
            Aucun outil dans cette catégorie.
          </div>
        )}
      </div>
    </main>
  );
}