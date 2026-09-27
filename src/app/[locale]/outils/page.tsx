import ToolCard from "@/components/tools/ToolCard";
import { categories, getCategoryName } from "@/lib/tools/categories";
import { tools } from "@/lib/tools/tools";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const t = getMessages(locale);
  const visibleCategories = categories.filter((category) => tools.some((tool) => tool.categoryId === category.id && tool.available));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="relative overflow-visible rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent)]/8 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{t.tools.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-5xl">{t.tools.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">{t.tools.description}</p>
        </div>
      </div>
      <div className="mt-12 space-y-14">
        {visibleCategories.map((category) => {
          const categoryTools = tools.filter((tool) => tool.categoryId === category.id && tool.available);
          return (
            <section key={category.id}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold tracking-[-0.02em] sm:text-2xl">{category.icon} {getCategoryName(locale, category.id)}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{categoryTools.length} {categoryTools.length === 1 ? t.tools.one : t.tools.many}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryTools.map((tool) => <ToolCard key={tool.id} tool={tool} categoryName={getCategoryName(locale, category.id)} />)}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
