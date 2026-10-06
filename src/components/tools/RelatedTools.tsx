import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getPrimaryToolCategory, getToolContent } from "@/lib/tools/types";
import { getMessages } from "@/lib/i18n/messages";
import { getAllTools, getToolById } from "@/lib/tools/catalog";
import { getNextActions } from "@/lib/tools/relations";
import { getToolPath } from "@/lib/tools/routes";

export default function NextActions({ toolId, locale }: { toolId: string; locale: Locale }) {
  const t = getMessages(locale);
  const allTools = getAllTools();
  const tool = getToolById(toolId);
  if (!tool) return null;

  const nextActions = getNextActions(tool, allTools);
  if (nextActions.length === 0) return null;

  return (
    <section aria-labelledby="next-actions-title">
      <h2 id="next-actions-title" className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">{t.nextActions.title}</h2>
      <div className="mt-4 grid divide-y divide-[var(--border)] border-y border-[var(--border)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
        {nextActions.map((nextAction) => {
          const content = getToolContent(nextAction, locale);
          return (
            <Link key={nextAction.id} href={getToolPath(locale, getPrimaryToolCategory(nextAction), nextAction.id)} className="group flex min-w-0 items-start gap-3 p-4 transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-soft)] text-lg" aria-hidden="true">{nextAction.icon}</span>
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
