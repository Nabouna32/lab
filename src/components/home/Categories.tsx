import CategoryCard from "@/components/home/CategoryCard";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default function Categories({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories.filter((category) => getToolCount(category.id) > 0);

  return (
    <section id="categories" className="border-t border-[var(--border)] scroll-mt-24" aria-labelledby="categories-title">
      <div className="mx-auto max-w-[var(--content-wide)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <h2 id="categories-title" className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">{t.home.categoriesTitle}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.categoriesDescription}</p>
          </div>
          <span className="hidden text-sm font-medium text-[var(--muted)] sm:inline-flex">
            {t.home.categoriesCount(visibleCategories.length)}
          </span>
        </div>
        <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              name={getCategoryName(locale, category.id)}
              toolLabel={t.tools.many}
              toolCount={getToolCount(category.id)}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
