import Link from "next/link";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { categories, getCategoryColor, getCategoryName, getToolCount } from "@/lib/tools/categories";
import { getPublishedTools, getToolById } from "@/lib/tools/catalog";
import { getCategoryPath, getToolsPath, getToolPath } from "@/lib/tools/routes";
import { getPrimaryToolCategory, getToolContent, isPublishedTool, type ToolId } from "@/lib/tools/types";

const featuredToolIds: ToolId[] = ["vat", "image-compressor", "json-formatter"];

export default function HomeDiscovery({ locale }: { locale: Locale }) {
  const t = getMessages(locale);
  const featuredTools = featuredToolIds.flatMap((id) => {
    const tool = getToolById(id);
    return tool && isPublishedTool(tool) ? [tool] : [];
  });
  const visibleCategories = categories
    .map((category) => ({ ...category, count: getToolCount(category.id) }))
    .filter((category) => category.count > 0);
  const total = getPublishedTools().length;

  return (
    <section className="mx-auto max-w-[var(--content-wide)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16" aria-labelledby="home-discovery-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t.home.discoveryEyebrow}</p>
          <h2 id="home-discovery-title" className="mt-2 text-2xl font-bold tracking-[-0.04em] sm:text-3xl">{t.home.discoveryTitle}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base">{t.home.discoveryDescription}</p>
        </div>
        <Link
          href={getToolsPath(locale)}
          className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[var(--accent)] outline-none transition-colors hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          {t.home.explore}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featuredTools.map((tool) => {
          const content = getToolContent(tool, locale);
          const categoryId = getPrimaryToolCategory(tool);
          const accentStyle = { "--tool-accent": getCategoryColor(categoryId) } as CSSProperties;
          return (
            <Link
              key={tool.id}
              href={getToolPath(locale, tool.id)}
              style={accentStyle}
              className="group relative flex min-h-36 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 outline-none transition-[border-color,transform,box-shadow] duration-[var(--motion-standard)] hover:-translate-y-0.5 hover:border-[var(--tool-accent)] hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:p-5"
            >
              <span className="absolute inset-y-0 left-0 w-1 bg-[var(--tool-accent)]" aria-hidden="true" />
              <span className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-soft)] text-xl" aria-hidden="true">{tool.icon}</span>
                <span className="mt-1 text-[var(--muted)] transition-transform group-hover:translate-x-0.5" aria-hidden="true">↗</span>
              </span>
              <span className="mt-4 font-semibold leading-snug">{content.name}</span>
              <span className="mt-1 text-sm leading-5 text-[var(--muted)]">{content.description}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 border-t border-[var(--border)] pt-7 sm:mt-12 sm:pt-9">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.03em] sm:text-2xl">{t.home.categoriesTitle}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[var(--muted)]">{t.home.categoriesDescription}</p>
          </div>
          <p className="text-sm text-[var(--muted)]">{total} {t.home.toolsCountLabel}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {visibleCategories.map((category) => (
            <Link
              key={category.id}
              href={getCategoryPath(locale, category.id)}
              className="group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: getCategoryColor(category.id) }} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">{getCategoryName(locale, category.id)}</span>
              <span className="text-xs tabular-nums text-[var(--muted)]">{category.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
