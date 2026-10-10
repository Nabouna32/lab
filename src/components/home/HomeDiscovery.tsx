import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryColor, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getCategoryPath, getToolsPath } from "@/lib/tools/routes";

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-10" aria-labelledby="home-discovery-title">
      <div className="border-t border-[var(--outline-variant)] pt-7 sm:pt-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t.home.discoveryEyebrow}</p>
            <h2 id="home-discovery-title" className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{t.home.categoriesTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.categoriesDescription}</p>
          </div>
          <Link
            href={getToolsPath(locale)}
            className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--accent)] outline-none transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {t.home.explore}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <nav aria-label={t.home.categoriesTitle} className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryPath(locale, category.id)}
              className="group inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-[background-color,border-color,transform,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--outline)] hover:bg-[var(--surface-soft)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: getCategoryColor(category.id) }} aria-hidden="true" />
              <span className="min-w-0 font-semibold text-[var(--foreground)]">{getCategoryName(locale, category.id)}</span>
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium tabular-nums text-[var(--muted)]">{category.count}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
