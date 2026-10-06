import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { getToolPath } from "@/lib/tools/routes";

export default function ToolCard({ tool, locale, categoryName }: { tool: Tool; locale: Locale; categoryName?: string }) {
  const content = getToolContent(tool, locale);

  return (
    <a
      href={getToolPath(locale, getPrimaryToolCategory(tool), tool.id)}
      className="group relative flex min-h-28 items-start gap-4 border-b border-[var(--border)] py-5 outline-none transition-[padding-left,background-color,border-color] duration-[var(--motion-standard)] hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] sm:px-3 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-inset"
    >
      <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] text-xl shadow-[var(--shadow-sm)] transition-[transform,border-color] duration-[var(--motion-standard)] group-hover:-translate-y-0.5 group-hover:border-[var(--accent)]/40" aria-hidden="true">
        {tool.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <h3 className="truncate font-bold tracking-[-0.02em] text-[var(--foreground)]">{content.name}</h3>
          {categoryName && <span className="hidden truncate text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] sm:inline">{categoryName}</span>}
        </span>
        <span className="mt-1 block line-clamp-2 max-w-2xl text-sm leading-5 text-[var(--muted)]">{content.description}</span>
      </span>
      <span className="mt-1 text-lg text-[var(--muted)] transition-[transform,color] duration-[var(--motion-standard)] group-hover:translate-x-1 group-hover:text-[var(--accent)]" aria-hidden="true">→</span>
    </a>
  );
}
