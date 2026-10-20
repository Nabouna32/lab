"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { RECENT_TOOLS_EVENT, RECENT_TOOLS_STORAGE_KEY, parseRecentToolIds } from "@/lib/tools/recent-tools";
import type { ToolId } from "@/lib/tools/types";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolPath } from "@/lib/tools/routes";

type RecentTool = { id: ToolId; name: string };

export default function RecentTools({ locale, tools }: { locale: Locale; tools: RecentTool[] }) {
  const [recentIds, setRecentIds] = useState<ToolId[]>([]);
  const t = getMessages(locale);
  const validIds = useMemo(() => tools.map((tool) => tool.id), [tools]);

  const sync = useCallback((event?: Event) => {
    const detail = event instanceof CustomEvent ? event.detail : null;
    if (Array.isArray(detail)) {
      setRecentIds(parseRecentToolIds(JSON.stringify(detail), validIds));
      return;
    }
    try {
      setRecentIds(parseRecentToolIds(localStorage.getItem(RECENT_TOOLS_STORAGE_KEY), validIds));
    } catch {
      setRecentIds([]);
    }
  }, [validIds]);

  useEffect(() => {
    let mounted = true;
    queueMicrotask(() => {
      if (mounted) sync();
    });
    const onRecentChange = (event: Event) => sync(event);
    const onStorage = (event: StorageEvent) => {
      if (event.key === RECENT_TOOLS_STORAGE_KEY || event.key === null) sync();
    };
    window.addEventListener(RECENT_TOOLS_EVENT, onRecentChange);
    window.addEventListener("storage", onStorage);
    return () => {
      mounted = false;
      window.removeEventListener(RECENT_TOOLS_EVENT, onRecentChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  const clear = () => {
    try {
      localStorage.removeItem(RECENT_TOOLS_STORAGE_KEY);
    } catch {
      // Clearing in-memory state still works when storage is unavailable.
    }
    setRecentIds([]);
    window.dispatchEvent(new CustomEvent(RECENT_TOOLS_EVENT, { detail: [] }));
  };

  const byId = new Map(tools.map((tool) => [tool.id, tool]));
  const recentTools = recentIds.flatMap((id) => {
    const tool = byId.get(id);
    return tool ? [tool] : [];
  });

  if (!recentTools.length) return null;

  return (
    <section className="mx-auto mt-2 w-full max-w-[var(--content-wide)] px-4 sm:px-6 lg:px-10" aria-labelledby="recent-tools-title">
      <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="recent-tools-title" className="text-base font-bold text-[var(--foreground)]">{t.home.recentToolsTitle}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t.home.recentToolsDescription}</p>
          </div>
          <button type="button" onClick={clear} className="min-h-11 rounded-full px-3 text-sm font-semibold text-[var(--accent)] outline-none hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            {t.home.clearRecentTools}
          </button>
        </div>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recentTools.map((tool) => (
            <li key={tool.id}>
              <Link href={getToolPath(locale, tool.id)} className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-container-low)] px-3 py-2 text-sm font-medium text-[var(--foreground)] outline-none transition-colors hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
                <MaterialIcon name="apps" size={20} className="shrink-0 text-[var(--accent)]" />
                <span className="min-w-0 flex-1">{tool.name}</span>
                <MaterialIcon name="arrow_forward" size={18} className="shrink-0 text-[var(--muted)]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
