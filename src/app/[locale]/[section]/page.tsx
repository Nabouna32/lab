import type { Metadata } from "next";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolCard from "@/components/tools/ToolCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { categories, getCategoryColor, getCategoryContainerColor, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getMessages } from "@/lib/i18n/messages";
import { formatPlural } from "@/lib/i18n/plural";
import { isLocale, type Locale, locales } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { PageContainer } from "@/components/layout/PageLayout";
import { getToolsForIntent, isIntentId } from "@/lib/tools/intents";
import { getCategoryPath, getGuidedWorkflowsPath, getToolsPath } from "@/lib/tools/routes";
import GuidedWorkflowsPage from "@/components/discovery/GuidedWorkflowsPage";

export function generateStaticParams() {
  return locales.flatMap((locale) => [
    { locale, section: getToolsPath(locale).split("/")[2] },
    { locale, section: getGuidedWorkflowsPath(locale).split("/")[2] },
  ]);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
}): Promise<Metadata> {
  const [{ locale: rawLocale, section }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) return {};
  const locale: Locale = rawLocale;
  if (section === getGuidedWorkflowsPath(locale).split("/")[2]) {
    const copy = locale === "fr"
      ? { title: "Parcours guidés | Loculary", description: "Des parcours pratiques pour enchaîner les bons outils Loculary et accomplir une tâche de bout en bout." }
      : { title: "Guided workflows | Loculary", description: "Practical paths that connect the right Loculary tools to help you complete a task from start to finish." };
    return getPublicPageMetadata({
      ...copy,
      path: getGuidedWorkflowsPath(locale),
    }, locale);
  }
  if (section !== getToolsPath(locale).split("/")[2]) return {};
  const t = getMessages(locale);
  const metadata = getPublicPageMetadata({
    title: t.tools.metaTitle,
    description: t.tools.description,
    path: getToolsPath(locale),
  }, locale);

  return query.intent ? { ...metadata, robots: { index: false, follow: true } } : metadata;
}

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const [{ locale: rawLocale, section }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  if (section === getGuidedWorkflowsPath(locale).split("/")[2]) {
    return <GuidedWorkflowsPage locale={locale} />;
  }
  if (section !== getToolsPath(locale).split("/")[2]) notFound();
  const t = getMessages(locale);
  const visibleCategories = categories.filter((category) => getToolCount(category.id) > 0);
  const publishedTools = getPublishedTools();
  const rawIntent = Array.isArray(query.intent) ? query.intent[0] : query.intent;
  const selectedIntentId = isIntentId(rawIntent) ? rawIntent : null;
  const selectedIntent = selectedIntentId ? t.tools.intents.find((intent) => intent.id === selectedIntentId) : undefined;
  const intentTools = selectedIntentId ? getToolsForIntent(selectedIntentId, publishedTools) : [];

  return (
    <main className="min-h-full">
      <PageContainer width="wide" spacing="compact">
        <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] sm:p-7 lg:p-9" aria-labelledby="tools-page-title">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative grid gap-7 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:gap-12">
            <div className="motion-reveal">
              <div className="m3-type-label-small flex items-center gap-2 uppercase text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {t.tools.eyebrow}
              </div>
              <h1 id="tools-page-title" className="m3-type-display-small mt-3">{t.tools.title}</h1>
              <p className="m3-type-body-large mt-4 max-w-xl text-[var(--muted)]">{t.tools.description}</p>
            </div>
            <div className="motion-reveal motion-reveal-delay">
              <ToolSearch locale={locale} instanceId="tools-page-search" />
              <div className="m3-type-label-small mt-3 flex items-center justify-between gap-4 text-[var(--muted)]">
                <span>{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</span>
                <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1">{t.nav.explore}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-5 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-md)] lg:sticky lg:top-24" aria-labelledby="tools-intents-heading">
            <div className="border-b border-[var(--border)] pb-4">
              <h2 id="tools-intents-heading" className="m3-type-label-medium uppercase text-[var(--muted)]">{t.tools.intentsTitle}</h2>
              <p className="m3-type-body-small mt-2 text-[var(--muted)]">{t.tools.intentsDescription}</p>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1">
              {t.tools.intents.map((intent) => (
                <a
                  key={intent.id}
                  href={`${getToolsPath(locale)}?intent=${intent.id}`}
                  aria-current={selectedIntentId === intent.id ? "page" : undefined}
                  className={`group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-3 m3-type-label-large outline-none transition-[transform,background-color,border-color] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--border)] hover:bg-[var(--accent-soft)] hover:text-[var(--on-primary-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] lg:flex ${selectedIntentId === intent.id ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--on-primary-container)]" : "border-transparent"}`}
                >
                  <span aria-hidden="true">{intent.icon}</span>
                  <span>{intent.label}</span>
                  <span className="ml-auto hidden text-[var(--muted)] group-hover:inline" aria-hidden="true"><MaterialIcon name="chevron_right" size={16} /></span>
                </a>
              ))}
            </div>
          </aside>

          <div className="min-w-0 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
            {selectedIntent ? (
              <section className="border-b border-[var(--border)] p-5 sm:p-7" aria-labelledby="tools-intent-results-heading" data-testid="intent-results" data-intent-id={selectedIntent.id}>
                <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                      <h2 id="tools-intent-results-heading" className="m3-type-headline-small mt-1">{t.tools.intentResultsTitle(selectedIntent.label)}</h2>
                    <p className="m3-type-body-medium mt-2 max-w-xl text-[var(--muted)]">{t.tools.intentResultsDescription}</p>
                  </div>
                  <a href={getToolsPath(locale)} className="m3-type-label-large inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--border)] px-3 hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{t.tools.clearIntent}</a>
                </div>
                <div className="mt-5 min-w-0 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
                  {intentTools.map((tool) => <div key={tool.id} data-testid="intent-result"><ToolCard tool={tool} locale={locale} categoryName={getCategoryName(locale, tool.categories[0])} categoryId={tool.categories[0]} /></div>)}
                </div>
              </section>
            ) : null}
            <section className="p-5 sm:p-7" aria-labelledby="tools-categories-heading">
              <div className="flex flex-col gap-2 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 id="tools-categories-heading" className="m3-type-headline-small mt-1">{t.tools.categoriesTitle}</h2>
                </div>
                <p className="m3-type-body-medium max-w-sm text-[var(--muted)]">{t.tools.categoriesDescription}</p>
              </div>

              <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-2">
                {visibleCategories.map((category) => (
                  <a
                    key={category.id}
                    href={getCategoryPath(locale, category.id)}
                    className="group flex min-w-0 min-h-20 items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/45 p-3.5 outline-none transition-[transform,border-color,background-color,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--accent)]/35 hover:bg-[var(--surface-soft)] hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-transparent text-xl shadow-[var(--shadow-sm)] transition-transform duration-[var(--motion-standard)] group-hover:scale-105" style={{ color: getCategoryColor(category.id), backgroundColor: getCategoryContainerColor(category.id) }} aria-hidden="true">{category.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="m3-type-title-medium block truncate">{getCategoryName(locale, category.id)}</span>
                      <span className="m3-type-body-small mt-0.5 block text-[var(--muted)]">{formatPlural(locale, getToolCount(category.id), { one: t.tools.one, other: t.tools.many })}</span>
                    </span>
                    <span className="text-lg transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" style={{ color: getCategoryColor(category.id) }} aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="border-t border-[var(--border)] p-5 sm:p-7" aria-labelledby="tools-all-heading">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="tools-all-heading" className="m3-type-headline-small mt-1">{t.tools.allToolsTitle}</h2>
                </div>
                <p className="m3-type-label-large text-[var(--muted)]">{formatPlural(locale, publishedTools.length, { one: t.tools.one, other: t.tools.many })}</p>
              </div>
              <div className="mt-5 min-w-0 divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)]">
                {publishedTools.map((tool) => <ToolCard key={tool.id} tool={tool} locale={locale} />)}
              </div>
            </section>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
