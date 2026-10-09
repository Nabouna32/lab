import type { Locale } from "@/lib/i18n/config";
import { getToolContent } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { Card } from "@/components/ui/Card";
import { getCategoryColor } from "@/lib/tools/categories";
import { getToolPath } from "@/lib/tools/routes";

export default function ToolCard({ tool, locale, categoryName, categoryId }: { tool: Tool; locale: Locale; categoryName?: string; categoryId?: string }) {
  const content = getToolContent(tool, locale);

  return (
    <Card
      href={getToolPath(locale, tool.id)}
      className="group flex min-h-40 flex-col p-4 transition-colors duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-xl" aria-hidden="true">{tool.icon}</span>
        <span className="min-w-0 flex-1">
          <h3 className="truncate font-bold tracking-[-0.02em]">{content.name}</h3>
          {categoryName && <span className="mt-0.5 block truncate text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: categoryId ? getCategoryColor(categoryId) : "var(--accent)" }}>{categoryName}</span>}
        </span>
        <span className="text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">↗</span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-5 text-[var(--muted)]">{content.description}</p>
    </Card>
  );
}
