import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getPrimaryToolCategory, getToolContent, isPublishedTool } from "@/lib/tools/types";
import { tools } from "@/lib/tools/tools";

function getWeekNumber(date: Date): number {
  const start = new Date(Date.UTC(2024, 0, 1));
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function getDiscoveryTools() {
  const availableTools = tools.filter(isPublishedTool);
  if (availableTools.length <= 6) return availableTools;

  const offset = ((getWeekNumber(new Date()) % availableTools.length) + availableTools.length) % availableTools.length;
  const rotated = [...availableTools.slice(offset), ...availableTools.slice(0, offset)];
  const selected = [];
  const seenCategories = new Set<string>();

  for (const tool of rotated) {
    if (!seenCategories.has(getPrimaryToolCategory(tool))) {
      selected.push(tool);
      seenCategories.add(getPrimaryToolCategory(tool));
    }
    if (selected.length === 6) return selected;
  }

  for (const tool of rotated) {
    if (!selected.includes(tool)) selected.push(tool);
    if (selected.length === 6) break;
  }

  return selected;
}

export default function DiscoverTools({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const featuredTools = getDiscoveryTools();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8" aria-labelledby="discover-tools-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id="discover-tools-title" className="text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            {t.home.discoveryTitle}
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] sm:text-base">{t.home.discoveryDescription}</p>
        </div>
        <Link
          href={`/${locale}/outils`}
          className="hidden shrink-0 rounded-full px-3 py-2 text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:inline-flex"
        >
          {t.home.explore}
          <span className="ml-1" aria-hidden="true">→</span>
        </Link>
      </div>

      <div
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        tabIndex={0}
        aria-label={t.home.discoveryTitle}
      >
        {featuredTools.map((tool) => {
          const content = getToolContent(tool, locale);

          return (
            <Link
              key={tool.id}
              href={`/${locale}/outils/${getPrimaryToolCategory(tool)}/${tool.slug}`}
              className="group flex w-[min(78vw,20rem)] min-w-[min(78vw,20rem)] snap-start flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:w-72 sm:min-w-72"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-2xl transition-transform duration-200 group-hover:scale-105" aria-hidden="true">
                {tool.icon}
              </span>
              <h3 className="mt-4 text-base font-bold tracking-[-0.02em]">{content.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{content.description}</p>
              <span className="mt-4 text-sm font-bold text-[var(--accent)]">
                {t.home.discoveryOpen}
                <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
              </span>
            </Link>
          );
        })}
      </div>

      <Link
        href={`/${locale}/outils`}
        className="mt-2 inline-flex rounded-full px-3 py-2 text-sm font-bold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:hidden"
      >
        {t.home.explore}
        <span className="ml-1" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
