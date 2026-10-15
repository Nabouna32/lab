"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ComponentLivePreview from "./ComponentLivePreview";
import ComponentMaintenancePanel from "./ComponentMaintenancePanel";

type Locale = "fr" | "en";
type AuditStatus = "unverified" | "partially-verified" | "discrepancy-confirmed" | "verification-required" | "conformant-within-verified-scope";
type Component = { id: string; name: string; category: string; implementation_path: string; preview_key: string | null; audit_status: AuditStatus; official_references: {label?:string;url?:string}[] };
type ReportSummary = { id: string; component_id: string; status: string };
const statusOptions: AuditStatus[] = ["unverified","partially-verified","discrepancy-confirmed","verification-required","conformant-within-verified-scope"];
const labels: Record<AuditStatus,{fr:string;en:string}> = {
  unverified:{fr:"Non vérifié",en:"Unverified"},
  "partially-verified":{fr:"Partiellement vérifié",en:"Partially verified"},
  "discrepancy-confirmed":{fr:"Écart confirmé",en:"Confirmed discrepancy"},
  "verification-required":{fr:"Vérification requise",en:"Verification required"},
  "conformant-within-verified-scope":{fr:"Conforme dans le périmètre vérifié",en:"Conformant within verified scope"},
};
export default function ComponentAuditWorkbench({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const db = useMemo(() => createClient(), []);
  const [components,setComponents] = useState<Component[]>([]);
  const [reports,setReports] = useState<ReportSummary[]>([]);
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("all");
  const [status,setStatus] = useState("all");
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [savingId,setSavingId] = useState("");
  const [expandedId,setExpandedId] = useState("");
  const [notice,setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      const [componentResult,reportResult] = await Promise.all([
        db.from("design_audit_components").select("id,name,category,implementation_path,preview_key,audit_status,official_references").order("category").order("name"),
        db.from("design_audit_reports").select("id,component_id,status"),
      ]);
      if (!active) return;
      if (componentResult.error || reportResult.error) setError(componentResult.error?.message ?? reportResult.error?.message ?? (fr ? "Impossible de charger le suivi." : "Unable to load maintenance records."));
      setComponents((componentResult.data ?? []) as Component[]);
      setReports((reportResult.data ?? []) as ReportSummary[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [db,fr]);

  const categories = useMemo(() => [...new Set(components.map(c=>c.category))].sort(),[components]);
  const filtered = useMemo(() => {
    const needle=query.trim().toLocaleLowerCase(locale);
    return components.filter(c=>(!needle || [c.name,c.id,c.category,c.implementation_path].some(s=>s.toLocaleLowerCase(locale).includes(needle)))
      && (category==="all"||c.category===category) && (status==="all"||c.audit_status===status));
  },[components,query,category,status,locale]);
  const openReports = reports.filter(r=>!["verified","wont-fix"].includes(r.status)).length;
  const proven = components.filter(c=>c.audit_status==="conformant-within-verified-scope").length;

  async function updateAuditStatus(component: Component, audit_status: AuditStatus) {
    setSavingId(component.id);setError("");setNotice("");
    const {error:issue}=await db.from("design_audit_components").update({audit_status}).eq("id",component.id);
    setSavingId("");if(issue){setError(issue.message);return;}
    setComponents(old=>old.map(c=>c.id===component.id?{...c,audit_status}:c));
    setNotice(fr?"Statut d’audit enregistré.":"Audit status saved.");
  }

  return <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="mb-8">
      <Link className="text-sm font-semibold text-[var(--accent)]" href={`/${locale}/design-lab`}>{fr?"← Retour au laboratoire visuel":"← Back to visual lab"}</Link>
      <p className="mt-5 text-sm font-semibold text-[var(--accent)]">Material 3 Fidelity · {fr?"Maintenance des composants":"Component maintenance"}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{fr?"Atelier de maintenance M3":"M3 maintenance workbench"}</h1>
      <p className="mt-3 max-w-3xl text-[var(--muted)]">{fr
        ?"Le catalogue est construit à partir des implémentations UI réelles du dépôt. Tu peux tester les composants raccordés, signaler un défaut, consigner les décisions et suivre les vérifications. La présence d’un composant ne prouve jamais sa conformité."
        :"The catalog is built from actual UI implementations in the repository. Test connected previews, report defects, record decisions and track verification. Component presence never proves conformance."}</p>
    </header>
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      <article className="rounded-2xl border border-[var(--border)] p-4"><p className="text-sm text-[var(--muted)]">{fr?"Implémentations réelles inventoriées":"Actual implementations inventoried"}</p><p className="mt-1 text-3xl font-semibold">{components.length}</p></article>
      <article className="rounded-2xl border border-[var(--border)] p-4"><p className="text-sm text-[var(--muted)]">{fr?"Signalements ouverts":"Open reports"}</p><p className="mt-1 text-3xl font-semibold">{openReports}</p></article>
      <article className="rounded-2xl border border-[var(--border)] p-4"><p className="text-sm text-[var(--muted)]">{fr?"Conformité vérifiée":"Verified conformance"}</p><p className="mt-1 text-3xl font-semibold">{proven}</p></article>
    </div>
    {error&&<p role="alert" className="mb-4 rounded-xl border border-[var(--danger)] p-3 text-sm">{error}</p>}
    {notice&&<p role="status" className="mb-4 rounded-xl border border-[var(--border)] p-3 text-sm">{notice}</p>}
    {loading?<p role="status" className="py-12 text-center text-[var(--muted)]">{fr?"Chargement de l’inventaire…":"Loading component inventory…"}</p>:<>
      <section className="mb-6 grid gap-3 rounded-2xl border border-[var(--border)] p-4 sm:grid-cols-[minmax(12rem,1fr)_minmax(10rem,0.5fr)_minmax(12rem,0.6fr)_auto]">
        <label className="text-sm font-medium">{fr?"Rechercher":"Search"}<input className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" value={query} onChange={e=>setQuery(e.target.value)} placeholder={fr?"Nom, fichier source…":"Name, source file…"}/></label>
        <label className="text-sm font-medium">{fr?"Famille":"Category"}<select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{fr?"Toutes":"All"}</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
        <label className="text-sm font-medium">{fr?"Statut d’audit":"Audit status"}<select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" value={status} onChange={e=>setStatus(e.target.value)}><option value="all">{fr?"Tous les statuts":"All statuses"}</option>{statusOptions.map(s=><option key={s} value={s}>{labels[s][locale]}</option>)}</select></label>
        <button type="button" className="self-end rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium" onClick={()=>{setQuery("");setCategory("all");setStatus("all");}}>{fr?"Réinitialiser":"Reset"}</button>
      </section>
      <p className="mb-3 text-sm text-[var(--muted)]">{fr?`${filtered.length} composant(s) affiché(s)`:`${filtered.length} component(s) shown`}</p>
      <div className="space-y-3">{filtered.map(component=>{
        const componentReports=reports.filter(r=>r.component_id===component.id&&!["verified","wont-fix"].includes(r.status)).length;
        return <details key={component.id} open={expandedId === component.id} className="rounded-2xl border border-[var(--border)]">
          <summary onClick={(event) => { event.preventDefault(); setExpandedId(expandedId === component.id ? "" : component.id); }} className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4">
            <span className="min-w-0 flex-1 font-semibold">{component.name}<span className="mt-1 block text-xs font-normal text-[var(--muted)]">{component.category} · {component.implementation_path}</span></span>
            <span className="rounded-full bg-[var(--surface-container)] px-3 py-1 text-xs">{labels[component.audit_status][locale]}</span>
            {componentReports>0&&<span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{componentReports} {fr?"ouvert(s)":"open"}</span>}
          </summary>
          {expandedId === component.id && <div className="border-t border-[var(--border)] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <label className="max-w-md flex-1 text-sm font-medium">{fr?"Statut de conformité":"Conformance status"}<select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" value={component.audit_status} disabled={savingId===component.id} onChange={e=>void updateAuditStatus(component,e.target.value as AuditStatus)}>{statusOptions.map(s=><option key={s} value={s}>{labels[s][locale]}</option>)}</select></label>
              <a className="text-sm font-semibold text-[var(--accent)] underline" href={`https://github.com/Nabouna32/lab/blob/main/${component.implementation_path}`} target="_blank" rel="noreferrer">{fr?"Ouvrir le code source ↗":"Open source ↗"}</a>
            </div>
            {component.official_references?.length>0&&<ul className="mt-3 list-disc pl-5 text-sm">{component.official_references.map((r,i)=><li key={i}>{r.url?<a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.label||r.url}</a>:r.label}</li>)}</ul>}
            <ComponentLivePreview key={component.id} previewKey={component.preview_key} locale={locale}/>
            <ComponentMaintenancePanel key={component.id} componentId={component.id} locale={locale}/>
          </div>}
        </details>;
      })}{filtered.length===0&&<p className="rounded-2xl border border-[var(--border)] p-8 text-center text-[var(--muted)]">{fr?"Aucun composant ne correspond aux filtres.":"No components match these filters."}</p>}</div>
    </>}
    <footer className="mt-8 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">{fr
      ?"Les observations, les conclusions techniques, les décisions et les vérifications sont enregistrées séparément. Un statut « conforme » doit rester étayé par des preuves."
      :"Observations, technical findings, decisions and verifications are stored separately. A “conformant” status must remain backed by evidence."}</footer>
  </main>;
}
