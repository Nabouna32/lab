import Link from "next/link";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryColor, getCategoryContainerColor, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getCategoryPath, getToolsPath } from "@/lib/tools/routes";

const RING_RADIUS = 86;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);
  const totalTools = getPublishedTools().length;
  const totalCategoryAssignments = visibleCategories.reduce((sum, category) => sum + category.count, 0);

  const ringSegments = visibleCategories.map((category, index) => {
    const segmentLength = (category.count / totalCategoryAssignments) * RING_CIRCUMFERENCE;
    const visibleLength = Math.max(0, segmentLength - 4);
    const precedingLength = visibleCategories
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.count / totalCategoryAssignments) * RING_CIRCUMFERENCE, 0);
    return {
      ...category,
      dashArray: `${visibleLength} ${RING_CIRCUMFERENCE - visibleLength}`,
      dashOffset: -precedingLength,
    };
  });

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8" aria-labelledby="home-discovery-title">
      <div className="border-t border-[var(--border)] pt-8 sm:pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t.home.discoveryEyebrow}</p>
            <h2 id="home-discovery-title" className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{t.home.categoriesTitle}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.categoriesDescription}</p>
          </div>
          <Link
            href={getToolsPath(locale)}
            className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--accent)] outline-none transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {t.home.explore}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-6 grid items-center gap-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] sm:mt-8 sm:grid-cols-[minmax(15rem,0.85fr)_1.15fr] sm:gap-8 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[19rem]">
            <svg viewBox="0 0 260 260" className="block w-full" role="img" aria-label={`${totalTools} ${t.home.toolsCountLabel}, ${t.home.categoriesCount(visibleCategories.length)}`}>
              <circle cx="130" cy="130" r={RING_RADIUS} fill="none" stroke="var(--surface-soft)" strokeWidth="20" />
              {ringSegments.map((segment) => (
                <circle
                  key={segment.id}
                  cx="130"
                  cy="130"
                  r={RING_RADIUS}
                  fill="none"
                  stroke={getCategoryColor(segment.id)}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.dashOffset}
                  transform="rotate(-90 130 130)"
                >
                  <title>{getCategoryName(locale, segment.id)} — {segment.count}</title>
                </circle>
              ))}
              <text x="130" y="125" textAnchor="middle" className="fill-[var(--foreground)] text-[36px] font-black tracking-[-0.05em]">{totalTools}</text>
              <text x="130" y="148" textAnchor="middle" className="fill-[var(--muted)] text-[11px] font-semibold">{t.home.toolsCountLabel}</text>
            </svg>
            <div className="mt-1 flex justify-center text-xs text-[var(--muted)]">
              <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 font-semibold">{t.home.categoriesCount(visibleCategories.length)}</span>
            </div>
          </div>

          <nav aria-label={t.home.categoriesTitle} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visibleCategories.map((category) => {
              const categoryStyle = {
                "--category-color": getCategoryColor(category.id),
                backgroundColor: getCategoryContainerColor(category.id),
                borderColor: getCategoryContainerColor(category.id),
              } as CSSProperties;
              return (
                <Link
                  key={category.id}
                  href={getCategoryPath(locale, category.id)}
                  style={categoryStyle}
                  className="group flex min-h-14 items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2.5 outline-none transition-[transform,border-color,box-shadow] duration-[var(--motion-fast)] hover:-translate-y-0.5 hover:border-[var(--category-color)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                >
                  <span className="h-3 w-3 shrink-0 rounded-full ring-2 ring-white/50" style={{ backgroundColor: getCategoryColor(category.id) }} aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-sm font-semibold text-[var(--foreground)]">{getCategoryName(locale, category.id)}</span>
                  <span className="min-w-7 rounded-full px-2 py-1 text-center text-xs font-bold tabular-nums text-[var(--foreground)]" style={{ backgroundColor: getCategoryContainerColor(category.id) }}>{category.count}</span>
                  <span className="text-sm text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
}
