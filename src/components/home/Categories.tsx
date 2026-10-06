import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getCategoryPath } from "@/lib/tools/routes";

export default function Categories({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories.filter((category) => getToolCount(category.id) > 0);

  return (
    <section id="categories" className="border-t border-[var(--border)] scroll-mt-24" aria-labelledby="categories-title">
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Loculary / Explorer</p>
            <h2 id="categories-title" className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">{t.home.categoriesTitle}</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.categoriesDescription}</p>
            <span className="mt-5 inline-flex border-l-2 border-[var(--accent)] pl-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {t.home.categoriesCount(visibleCategories.length)}
            </span>
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
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">{getToolCount(category.id)} {t.tools.many}</span>
                  </span>
                </span>
                <span className="text-lg text-[var(--muted)] transition-[transform,color] duration-[var(--motion-standard)] group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
