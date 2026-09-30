import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { Card } from "@/components/ui/Card";
import { getToolPath } from "@/lib/tools/routes";

export default function ToolCard({ tool, locale, categoryName }: { tool: Tool; locale: Locale; categoryName?: string }) {
  const content = getToolContent(tool, locale);
  return (
    <Card href={getToolPath(locale, getPrimaryToolCategory(tool), tool.id)} className="group flex min-h-52 flex-col p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--accent-soft)] text-2xl transition-transform duration-300 group-hover:scale-105">{tool.icon}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--muted)] transition-[transform,background-color,color] duration-300 group-hover:translate-x-1 group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--accent)]" aria-hidden="true">↗</span>
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-[-0.02em]">{content.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-[var(--muted)]">{content.description}</p>
      {categoryName && <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--accent)]">{categoryName}</p>}
    </Card>
  );
}
