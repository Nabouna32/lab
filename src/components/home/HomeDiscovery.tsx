import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryColor, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getCategoryPath } from "@/lib/tools/routes";

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-10" aria-labelledby="home-discovery-title">
      <div className="border-t border-[var(--outline-variant)] pt-7 sm:pt-9">
        <h2 id="home-discovery-title" className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{t.home.categoriesTitle}</h2>

        <nav aria-label={t.home.categoriesTitle} className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3 lg:grid lg:grid-cols-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryPath(locale, category.id)}
              className="group inline-flex min-h-12 max-w-full items-center gap-2.5 rounded-[var(--radius-xl)] border border-[var(--outline-variant)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition-[background-color,border-color,transform,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--outline)] hover:bg-[var(--surface-soft)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] lg:w-full"
            >
              <span className="h-3 w-3 shrink-0 rounded-full border border-[var(--outline)]" style={{ backgroundColor: getCategoryColor(category.id) }} aria-hidden="true" />
              <span className="min-w-0 font-semibold text-[var(--foreground)] lg:flex-1">{getCategoryName(locale, category.id)}</span>
              <span className="rounded-full bg-[var(--surface-soft)] px-2 py-1 text-xs font-medium tabular-nums text-[var(--muted)]">{category.count}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
