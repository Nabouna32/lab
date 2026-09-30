import type { Metadata } from "next";
import ToolSearch from "@/components/tools/ToolSearch";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { getToolsPath, getCategoryPath } from "@/lib/tools/routes";

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

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-visible rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8 lg:p-10">
        <div className="decorative-glow pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.tools.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{t.tools.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t.tools.description}</p>
          <div className="mx-auto mt-7 max-w-2xl text-left">
            <ToolSearch locale={locale} instanceId="tools-page-search" />
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-12" aria-labelledby="tools-categories-heading">
        <div className="mb-5">
          <h2 id="tools-categories-heading" className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{t.tools.categoriesTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{t.tools.categoriesDescription}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => {
            const count = getToolCount(category.id);
            return (
              <a
                key={category.id}
                href={getCategoryPath(locale, category.id)}
                className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-2xl" aria-hidden="true">{category.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold tracking-[-0.01em]">{getCategoryName(locale, category.id)}</span>
                  <span className="mt-1 block text-sm text-[var(--muted)]">{formatPlural(locale, count, { one: t.tools.one, other: t.tools.many })}</span>
                </span>
                <span className="text-lg text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
