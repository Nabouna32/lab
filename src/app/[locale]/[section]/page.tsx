import type { Metadata } from "next";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getCategoryPath, getToolsPath } from "@/lib/tools/routes";

const intentCategoryMap: Record<string, string[]> = {
  calculate: ["calculations"],
  convert: ["computing"],
  generate: ["development"],
  analyze: ["files", "video"],
  measure: ["dates", "calculations"],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale, section: getToolsPath(locale).split("/")[2] }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; section: string }> }): Promise<Metadata> {
  const { locale: rawLocale, section } = await params;
  if (!isLocale(rawLocale) || section !== getToolsPath(rawLocale).split("/")[2]) return {};
  const locale: Locale = rawLocale;
  const t = getMessages(locale);
  return getPublicPageMetadata({
    title: t.tools.metaTitle,
    description: t.tools.description,
    path: getToolsPath(locale),
    alternatePaths: Object.fromEntries(locales.map((availableLocale) => [availableLocale, getToolsPath(availableLocale)])),
  }, locale);
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string; section: string }> }) {
  const { locale: rawLocale, section } = await params;
  if (!isLocale(rawLocale) || section !== getToolsPath(rawLocale).split("/")[2]) notFound();

  const locale: Locale = rawLocale;
  const t = getMessages(locale);
  const visibleCategories = categories.filter((category) => getToolCount(category.id) > 0);
  const publishedTools = getPublishedTools();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="border-b border-[var(--border)] pb-8 sm:pb-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.tools.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{t.tools.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t.tools.description}</p>
        </div>
        <div className="mt-7 max-w-3xl">
          <ToolSearch locale={locale} instanceId="tools-page-search" />
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-8 sm:py-10" aria-labelledby="tools-intents-heading">
        <div className="mb-4 max-w-2xl">
          <h2 id="tools-intents-heading" className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{t.tools.intentsTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{t.tools.intentsDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {t.tools.intents.map((intent) => {
            const categoryId = (intentCategoryMap[intent.id] ?? []).find((id) => getToolCount(id) > 0);
            if (!categoryId) return null;
            return (
              <a
                key={intent.id}
                href={getCategoryPath(locale, categoryId)}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <span aria-hidden="true">{intent.icon}</span>
                {intent.label}
              </a>
            );
          })}
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-8 sm:py-10" aria-labelledby="tools-categories-heading">
        <div className="mb-5 max-w-2xl">
          <h2 id="tools-categories-heading" className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{t.tools.categoriesTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{t.tools.categoriesDescription}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const count = getToolCount(category.id);
            return (
              <a
                key={category.id}
                href={getCategoryPath(locale, category.id)}
                className="group flex min-h-16 items-center gap-3 border border-[var(--border)] bg-[var(--surface)] px-4 py-3 transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-lg" aria-hidden="true">{category.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold tracking-[-0.01em]">{getCategoryName(locale, category.id)}</span>
                  <span className="mt-0.5 block text-xs text-[var(--muted)]">{formatPlural(locale, count, { one: t.tools.one, other: t.tools.many })}</span>
                </span>
                <span className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="py-8 sm:py-10" aria-labelledby="tools-all-heading">
        <div className="mb-5">
          <h2 id="tools-all-heading" className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{t.tools.allToolsTitle}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publishedTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
        </div>
      </section>
    </main>
  );
}
