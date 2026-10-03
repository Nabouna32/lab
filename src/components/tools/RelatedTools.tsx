import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getAllTools, getToolById } from "@/lib/tools/catalog";
import { getRelatedTools } from "@/lib/tools/relations";
import { getToolPath } from "@/lib/tools/routes";

export default function RelatedTools({ toolId, locale }: { toolId: string; locale: Locale }) {
  const t = getMessages(locale);
  const allTools = getAllTools();
  const tool = getToolById(toolId);
  if (!tool) return null;

  const relatedTools = getRelatedTools(tool, allTools);
  if (relatedTools.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-title">
      <h2 id="related-tools-title" className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">{t.relatedTools.title}</h2>
      <div className="mt-4 grid divide-y divide-[var(--border)] border-y border-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        {relatedTools.map((relatedTool) => {
          const content = getToolContent(relatedTool, locale);
          return (
            <Link key={relatedTool.id} href={getToolPath(locale, getPrimaryToolCategory(relatedTool), relatedTool.id)} className="group flex min-w-0 items-start gap-3 p-4 transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-lg" aria-hidden="true">{relatedTool.icon}</span>
              <span className="min-w-0">
                <h3 className="font-semibold text-[var(--foreground)]">{content.name}</h3>
                <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{content.description}</p>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
