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
    <main className="min-h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[var(--content-wide)]">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] sm:p-7 lg:p-9" aria-labelledby="tools-page-title">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-12">
            <div className="motion-reveal">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {t.tools.eyebrow}
              </div>
              <h1 id="tools-page-title" className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl lg:text-6xl">{t.tools.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{t.tools.description}</p>
            </div>
            <div className="motion-reveal motion-reveal-delay">
              <ToolSearch locale={locale} instanceId="tools-page-search" />
              <div className="mt-3 flex items-center justify-between gap-4 text-xs font-semibold text-[var(--muted)]">
                <span>{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1">{t.nav.explore}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-md)] lg:sticky lg:top-24" aria-labelledby="tools-intents-heading">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 id="tools-intents-heading" className="text-xs font-black uppercase tracking-[0.16em] text-[var(--muted)]">{t.tools.intentsTitle}</h2>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.tools.intentsDescription}</p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1">
              {t.tools.intents.map((intent) => {
                const categoryId = (intentCategoryMap[intent.id] ?? []).find((id) => getToolCount(id) > 0);
                if (!categoryId) return null;
                return (
                  <a
                    key={intent.id}
                    href={getCategoryPath(locale, categoryId)}
                    className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-bold outline-none transition-[transform,background-color,border-color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] lg:flex"
                  >
                    <span aria-hidden="true">{intent.icon}</span>
                    <span>{intent.label}</span>
                    <span className="ml-auto hidden text-[var(--muted)] group-hover:inline" aria-hidden="true">↗</span>
                  </a>
                );
              })}
            </div>
          </aside>

          <div className="min-w-0 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
            <section className="p-5 sm:p-7" aria-labelledby="tools-categories-heading">
              <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">01</p>
                  <h2 id="tools-categories-heading" className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl">{t.tools.categoriesTitle}</h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">{t.tools.categoriesDescription}</p>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {visibleCategories.map((category, index) => (
                  <a
                    key={category.id}
                    href={getCategoryPath(locale, category.id)}
                    className="group flex min-h-20 items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/45 p-3.5 outline-none transition-[transform,border-color,background-color,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:bg-[var(--accent-soft)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <span className="font-mono text-[10px] font-bold text-[var(--muted)]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xl shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-standard)] group-hover:scale-105" aria-hidden="true">{category.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-black">{getCategoryName(locale, category.id)}</span>
                      <span className="mt-0.5 block text-xs text-[var(--muted)]">{formatPlural(locale, getToolCount(category.id), { one: t.tools.one, other: t.tools.many })}</span>
                    </span>
                    <span className="text-lg text-[var(--muted)] transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="border-t border-[var(--border)] p-5 sm:p-7" aria-labelledby="tools-all-heading">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">02</p>
                  <h2 id="tools-all-heading" className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl">{t.tools.allToolsTitle}</h2>
                </div>
                <p className="text-sm font-semibold text-[var(--muted)]">{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</p>
              </div>
              <div className="mt-5 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
                {publishedTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
