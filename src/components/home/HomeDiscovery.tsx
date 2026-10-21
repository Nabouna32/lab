import Link from "next/link";
import CategoryCard from "@/components/home/CategoryCard";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { getGuidedWorkflowsPath, getToolsPath } from "@/lib/tools/routes";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);

  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-10">
      <section aria-labelledby="home-intents-title" className="pt-2 sm:pt-3">
        <div className="max-w-2xl">
          <h2 id="home-intents-title" className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
            {t.tools.intentsTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:text-base">
            {t.tools.intentsDescription}
          </p>
        </div>

        <nav aria-label={t.tools.intentsTitle} className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {t.tools.intents.map((intent) => (
            <Link
              key={intent.id}
              href={`${getToolsPath(locale)}?intent=${intent.id}`}
              className="group flex min-h-12 min-w-0 items-center gap-3 rounded-2xl border border-[var(--outline-variant)]/70 bg-[var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] outline-none transition-[background-color,border-color,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-base text-[var(--accent)]" aria-hidden="true">
                {intent.icon}
              </span>
              <span className="min-w-0 flex-1">{intent.label}</span>
              <span className="shrink-0 text-[var(--muted)] transition-transform duration-[var(--motion-standard)] group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="mt-5" aria-labelledby="home-workflows-title">
        <Link
          href={getGuidedWorkflowsPath(locale)}
          className="group flex flex-col gap-3 rounded-2xl border border-[var(--outline-variant)]/70 bg-[var(--surface-container-low)] p-4 outline-none transition-[border-color,background-color,transform] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <span className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-xl text-[var(--accent)]" aria-hidden="true">↗</span>
            <span className="min-w-0">
              <span id="home-workflows-title" className="block font-black">{t.guidedWorkflows.homeTitle}</span>
              <span className="mt-1 block max-w-2xl text-sm leading-6 text-[var(--muted)]">{t.guidedWorkflows.homeDescription}</span>
            </span>
          </span>
          <span className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-bold text-[var(--on-primary)]">
            {t.guidedWorkflows.homeAction} <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>

      <section className="mt-8 sm:mt-10" aria-labelledby="home-discovery-title">
        <h2 id="home-discovery-title" className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
          {t.home.categoriesTitle}
        </h2>

        <nav aria-label={t.home.categoriesTitle} className="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              name={getCategoryName(locale, category.id)}
              toolLabel={formatPlural(locale, category.count, { one: t.tools.one, other: t.tools.many })}
              locale={locale}
            />
          ))}
        </nav>
      </section>
    </div>
  );
}
