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
    <main
      style={{ viewTransitionName: "loculary-explorer-surface" }}
      className="mx-auto max-w-[var(--content-wide)] rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] px-4 py-6 shadow-[var(--shadow-md)] sm:px-6 sm:py-8 lg:px-8 lg:py-10"
    >
      <section className="relative overflow-hidden border-y border-[var(--border)] py-8 sm:py-10 lg:py-12" aria-labelledby="tools-page-title">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--accent-soft)] opacity-80 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:gap-16">
          <div className="motion-reveal">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.tools.eyebrow}</p>
            <h1 id="tools-page-title" className="mt-3 text-4xl font-black tracking-[-0.055em] sm:text-5xl lg:text-6xl">{t.tools.title}</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t.tools.description}</p>
          </div>
          <div className="motion-reveal motion-reveal-delay">
            <ToolSearch locale={locale} instanceId="tools-page-search" />
            <p className="mt-3 text-xs font-medium text-[var(--muted)]">{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] py-7 sm:py-9" aria-labelledby="tools-intents-heading">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
          <div className="shrink-0">
            <h2 id="tools-intents-heading" className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.tools.intentsTitle}</h2>
            <p className="mt-1 hidden max-w-xs text-xs leading-5 text-[var(--muted)] sm:block">{t.tools.intentsDescription}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {t.tools.intents.map((intent) => {
              const categoryId = (intentCategoryMap[intent.id] ?? []).find((id) => getToolCount(id) > 0);
              if (!categoryId) return null;
              return (
                <a
                  key={intent.id}
                  href={getCategoryPath(locale, categoryId)}
                  className="group inline-flex min-h-10 items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm font-semibold outline-none transition-[transform,border-color,background-color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <span aria-hidden="true">{intent.icon}</span>
                  {intent.label}
                  <span className="text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-9 sm:py-12" aria-labelledby="tools-categories-heading">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 id="tools-categories-heading" className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{t.tools.categoriesTitle}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{t.tools.categoriesDescription}</p>
          </div>
          <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {visibleCategories.map((category, index) => (
              <a
                key={category.id}
                href={getCategoryPath(locale, category.id)}
                className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-2 py-4 outline-none transition-[background-color,padding] duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] sm:px-4 sm:py-5 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-inset"
              >
                <span className="font-mono text-xs text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-lg transition-transform duration-[var(--motion-standard)] group-hover:scale-[1.05]" aria-hidden="true">{category.icon}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{getCategoryName(locale, category.id)}</span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">{formatPlural(locale, getToolCount(category.id), { one: t.tools.one, other: t.tools.many })}</span>
                  </span>
                </span>
                <span className="text-lg text-[var(--muted)] transition-[transform,color] duration-[var(--motion-standard)] group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--border)] pt-9 sm:pt-12" aria-labelledby="tools-all-heading">
        <div className="mb-2 flex items-end justify-between gap-4">
          <div>
            <h2 id="tools-all-heading" className="text-2xl font-black tracking-[-0.04em] sm:text-3xl">{t.tools.allToolsTitle}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</p>
          </div>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {publishedTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
        </div>
      </section>
    </main>
  );
}
