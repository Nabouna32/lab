import CategoryCard from "@/components/home/CategoryCard";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryName, getToolCount } from "@/lib/tools/categories";

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-10" aria-labelledby="home-discovery-title">
      <div className="pt-2 sm:pt-3">
        <h2 id="home-discovery-title" className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{t.home.categoriesTitle}</h2>

        <nav aria-label={t.home.categoriesTitle} className="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {visibleCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              name={getCategoryName(locale, category.id)}
              toolLabel={category.count === 1 ? t.tools.one : t.tools.many}
              toolCount={category.count}
              locale={locale}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}
