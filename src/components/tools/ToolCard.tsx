import type { Locale } from "@/lib/i18n/config";
import { getToolContent } from "@/lib/tools/types";
import type { Tool } from "@/lib/tools/types";
import { CardLink } from "@/components/ui/Card";
import { getCategoryColor } from "@/lib/tools/categories";
import { getToolPath } from "@/lib/tools/routes";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { Row } from "@/components/layout/compose/Row";

export default function ToolCard({ tool, locale, categoryName, categoryId }: { tool: Tool; locale: Locale; categoryName?: string; categoryId?: string }) {
  const content = getToolContent(tool, locale);

  return (
    <CardLink
      href={getToolPath(locale, tool.id)}
      className="group block w-full min-w-0 transition-colors duration-200 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
    >
      <Column verticalArrangement={Arrangement.spacedBy("var(--space-3)")} className="min-h-40 w-full min-w-0 p-4">
      <Row horizontalArrangement={Arrangement.Start} className="w-full min-w-0 gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--shape-corner-medium)] bg-[var(--accent-soft)] text-xl" aria-hidden="true">{tool.icon}</span>
        <span className="min-w-0 flex-1">
          <h3 className="m3-type-title-medium truncate">{content.name}</h3>
          {categoryName && <span className="m3-type-label-small mt-0.5 block truncate uppercase" style={{ color: categoryId ? getCategoryColor(categoryId) : "var(--accent)" }}>{categoryName}</span>}
        </span>
        <span className="text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true"><MaterialIcon name="chevron_right" size={18} /></span>
      </Row>
      <p className="m3-type-body-medium line-clamp-2 text-[var(--muted)]">{content.description}</p>
      </Column>
    </CardLink>
  );
}
