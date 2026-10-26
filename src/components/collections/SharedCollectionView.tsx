"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import type { Locale } from "@/lib/i18n/config";
import { getPublishedTools } from "@/lib/tools/catalog";
import { getToolContent, type ToolId } from "@/lib/tools/types";
import { getToolPath } from "@/lib/tools/routes";

type SharedData = { name: string; tools: Array<{ id: string; icon: string; name: string; description: string; href: string }> };

export default function SharedCollectionView({ locale, token }: { locale: Locale; token: string }) {
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const fr = locale === "fr";

  useEffect(() => {
    let active = true;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { global: { headers: { "x-loculary-share-token": token } } },
    );
    async function load() {
      const { data: collection, error } = await supabase.from("user_collections")
        .select("id,name,user_collection_items(tool_id)").eq("share_token", token).maybeSingle();
      if (!active) return;
      if (error || !collection) { setData(null); setLoading(false); return; }
      const byId = new Map(getPublishedTools().map((tool) => {
        const content = getToolContent(tool, locale);
        return [tool.id, { id: tool.id, icon: tool.icon, name: content.name, description: content.description, href: getToolPath(locale, tool.id) }];
      }));
      const tools = (collection.user_collection_items ?? []).map((item: { tool_id: string }) => byId.get(item.tool_id as ToolId)).filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));
      setData({ name: collection.name, tools });
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [locale, token]);

  return <main className="mx-auto min-h-[60svh] max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
    <header className="mb-7 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)] sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">Loculary · {fr ? "Collection partagée" : "Shared collection"}</p>
      <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{loading ? (fr ? "Chargement…" : "Loading…") : data?.name ?? (fr ? "Lien indisponible" : "Link unavailable")}</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{data ? (fr ? "Cette sélection a été partagée volontairement par son propriétaire." : "This selection was explicitly shared by its owner.") : (fr ? "Ce lien est invalide ou son propriétaire a désactivé le partage." : "This link is invalid or its owner disabled sharing.")}</p>
    </header>
    {data && (data.tools.length ? <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.tools.map((tool) => <li key={tool.id} className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]"><div className="flex items-start gap-3"><span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-2xl">{tool.icon}</span><div className="min-w-0"><Link href={tool.href} className="font-bold hover:underline">{tool.name}</Link><p className="mt-1 text-sm text-[var(--muted)]">{tool.description}</p></div></div></li>)}</ul> : <p className="rounded-[var(--radius-xl)] border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">{fr ? "Cette collection ne contient pas encore d’outils." : "This collection does not contain any tools yet."}</p>)}
  </main>;
}
