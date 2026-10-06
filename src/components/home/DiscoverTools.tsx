import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolPath, getToolsPath } from "@/lib/tools/routes";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import { getPublishedTools } from "@/lib/tools/catalog";

function getWeekNumber(date: Date): number {
  const start = new Date(Date.UTC(2024, 0, 1));
  const current = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((current - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function getDiscoveryTools() {
  const availableTools = getPublishedTools();
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
    <section className="relative mx-auto max-w-[var(--content-wide)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="discover-tools-title">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent-soft)] blur-2xl" aria-hidden="true" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Loculary</p>
            <div className="mt-3 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h2 id="discover-tools-title" className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
            {t.home.discoveryTitle}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.discoveryDescription}</p>
        </div>
        <Link
          href={getToolsPath(locale)}
          className="hidden shrink-0 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:inline-flex"
        >
          {t.home.explore}<span className="ml-1" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-2 divide-y divide-[var(--border)]">
        {featuredTools.map((tool) => {
          const content = getToolContent(tool, locale);
          return (
            <Link
              key={tool.id}
              href={getToolPath(locale, getPrimaryToolCategory(tool), tool.id)}
              className={"group grid gap-3 py-5 transition-[background-color,transform] duration-[var(--motion-standard)] hover:bg-[var(--surface-soft)] sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-4 " + (featuredTools.indexOf(tool) === 0 ? "sm:rounded-[var(--radius-lg)] sm:px-5 sm:py-6" : "")}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-xl transition-transform duration-[var(--motion-standard)] group-hover:scale-[1.04]" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold text-[var(--foreground)]">{content.name}</span>
                <span className="mt-1 block max-w-2xl truncate text-sm text-[var(--muted)]">{content.description}</span>
              </span>
              <span className="text-sm font-semibold text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
            </Link>
          );
        })}
      </div>

      <Link
        href={getToolsPath(locale)}
        className="mt-5 inline-flex text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:hidden"
      >
        {t.home.explore}<span className="ml-1" aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
