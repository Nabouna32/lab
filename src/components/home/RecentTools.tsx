"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { TextButton } from "@/components/ui/Button";
import type { ToolId } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolPath } from "@/lib/tools/routes";
import { PageContainer } from "@/components/layout/PageLayout";
import { useRecentTools } from "./RecentToolsProvider";

type RecentTool = { id: ToolId; name: string };

export default function RecentTools({ locale, tools }: { locale: Locale; tools: RecentTool[] }) {
  const { recentIds, clearRecentTools } = useRecentTools();
  const t = getMessages(locale);
  const byId = useMemo(() => new Map(tools.map((tool) => [tool.id, tool])), [tools]);
  const recentTools = recentIds.flatMap((id) => {
    const tool = byId.get(id);
    return tool ? [tool] : [];
  });

  if (!recentTools.length) return null;

  return (
    <PageContainer width="wide" spacing="none" className="mt-[var(--space-2)]">
      <section aria-labelledby="recent-tools-title">
        <div className="rounded-[var(--m3-card-shape)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="recent-tools-title" className="m3-type-title-medium text-[var(--foreground)]">{t.home.recentToolsTitle}</h2>
              <p className="m3-type-body-medium mt-1 text-[var(--muted)]">{t.home.recentToolsDescription}</p>
            </div>
            <TextButton type="button" onClick={clearRecentTools} className="shrink-0">
              {t.home.clearRecentTools}
            </TextButton>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recentTools.map((tool) => (
              <li key={tool.id}>
                <Link href={getToolPath(locale, tool.id)} className="m3-type-label-large flex min-h-12 items-center gap-3 rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--surface-container-low)] px-3 py-2 text-[var(--foreground)] outline-none transition-colors hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
                  <MaterialIcon name="apps" size={20} className="shrink-0 text-[var(--accent)]" />
                  <span className="min-w-0 flex-1">{tool.name}</span>
                  <MaterialIcon name="arrow_forward" size={18} className="shrink-0 text-[var(--muted)]" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageContainer>
  );
}
