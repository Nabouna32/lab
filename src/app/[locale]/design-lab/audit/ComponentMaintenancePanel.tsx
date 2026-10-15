"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
type Locale = "fr" | "en";
type Report = { id: string; title: string; description: string; issue_type: string; component_state: string; severity: string; status: string; expected_behavior: string | null; created_at: string };
type Decision = { id: string; title: string; rationale: string; status: string; created_at: string; approved_by?: string | null; approved_at?: string | null; official_references: {label?:string;url?:string}[] };
type Verification = { id: string; verification_type: string; result: string; notes: string; reference_url: string | null; pull_request_url: string | null; commit_sha: string | null; created_at: string };
type Event = { id: number; event_type: string; details: { title?: string | null; old_status?: string | null; new_status?: string | null }; created_at: string };
const statuses = ["new", "triage", "confirmed", "in-progress", "fixed", "verified", "reopened", "wont-fix"];
const frenchValues: Record<string, string> = {
  new: "Nouveau", triage: "À qualifier", confirmed: "Confirmé", "in-progress": "En cours", fixed: "Corrigé", verified: "Vérifié", reopened: "Réouvert", "wont-fix": "Ne sera pas corrigé",
  proposed: "Proposée", approved: "Approuvée", rejected: "Rejetée", superseded: "Remplacée",
  visual: "Visuel", behavior: "Comportement", accessibility: "Accessibilité", theme: "Thème", content: "Contenu", other: "Autre",
  general: "Général", default: "Normal", hover: "Survol", focus: "Focus clavier", pressed: "Appuyé", disabled: "Désactivé", selected: "Sélectionné", expanded: "Développé", loading: "Chargement", error: "Erreur",
  low: "Basse", normal: "Normale", high: "Haute", blocker: "Bloquante", architecture: "Architecture",
  "source-review": "Revue du code", interaction: "Interaction", "automated-test": "Test automatisé", "manual-test": "Test manuel",
  pass: "Réussi", fail: "Échec", inconclusive: "Non concluant",
};
export default function ComponentMaintenancePanel({ componentId, locale }: { componentId: string; locale: Locale }) {
  const fr = locale === "fr";
  const labelValue = (value: string) => fr ? (frenchValues[value] ?? value) : value;
  const db = useMemo(() => createClient(), []);
  const [reports, setReports] = useState<Report[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [checks, setChecks] = useState<Verification[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState("visual");
  const [state, setState] = useState("general");
  const [severity, setSeverity] = useState("normal");
  const [expected, setExpected] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [decisionRationale, setDecisionRationale] = useState("");
  const [decisionReference, setDecisionReference] = useState("");
  const [checkType, setCheckType] = useState("visual");
  const [checkResult, setCheckResult] = useState("inconclusive");
  const [checkNotes, setCheckNotes] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [pr, setPr] = useState("");
  const [sha, setSha] = useState("");
  const [busy, setBusy] = useState(true);
  const load = useCallback(async () => {
    setBusy(true); setError("");
    const [a,b,c,d] = await Promise.all([
      db.from("design_audit_reports").select("id,title,description,issue_type,component_state,severity,status,expected_behavior,created_at").eq("component_id",componentId).order("created_at",{ascending:false}),
      db.from("design_audit_decisions").select("id,title,rationale,status,created_at,approved_by,approved_at,official_references").eq("component_id",componentId).order("created_at",{ascending:false}),
      db.from("design_audit_verifications").select("id,verification_type,result,notes,reference_url,pull_request_url,commit_sha,created_at").eq("component_id",componentId).order("created_at",{ascending:false}),
      db.from("design_audit_events").select("id,event_type,details,created_at").eq("component_id",componentId).order("created_at",{ascending:false}).limit(15),
    ]);
    const issue = a.error ?? b.error ?? c.error ?? d.error;
    if (issue) setError(issue.message);
    setReports((a.data ?? []) as Report[]); setDecisions((b.data ?? []) as Decision[]);
    setChecks((c.data ?? []) as Verification[]); setEvents((d.data ?? []) as Event[]); setBusy(false);
  }, [componentId,db]);
  useEffect(() => { void load(); }, [load]);
  async function submitReport(e: FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const {error: issue} = await db.from("design_audit_reports").insert({component_id:componentId,title:title.trim(),description:description.trim(),issue_type:kind,component_state:state,severity,expected_behavior:expected.trim()||null});
    setSaving(false); if(issue){setError(issue.message);return;} setTitle("");setDescription("");setExpected("");await load();
  }
  async function changeStatus(id:string,status:string) {
    const {error: issue}=await db.from("design_audit_reports").update({status,resolved_at:status==="verified"||status==="wont-fix"?new Date().toISOString():null}).eq("id",id);
    if(issue)setError(issue.message);else await load();
  }
  async function submitDecision(e:FormEvent) {
    e.preventDefault();setSaving(true);setError("");
    const {error:issue}=await db.from("design_audit_decisions").insert({component_id:componentId,title:decisionTitle.trim(),rationale:decisionRationale.trim(),decision_type:"other",official_references:decisionReference.trim()?[{label:"Official reference",url:decisionReference.trim()}]:[]});
    setSaving(false);if(issue){setError(issue.message);return;}setDecisionTitle("");setDecisionRationale("");setDecisionReference("");await load();
  }
  async function changeDecisionStatus(id: string, status: string) {
    const { data: authData } = await db.auth.getUser();
    const { error: issue } = await db.from("design_audit_decisions").update({
      status,
      approved_by: status === "approved" ? authData.user?.id ?? null : null,
      approved_at: status === "approved" ? new Date().toISOString() : null,
    }).eq("id", id);
    if (issue) setError(issue.message); else await load();
  }
  async function submitCheck(e:FormEvent) {
    e.preventDefault();setSaving(true);setError("");
    const {error:issue}=await db.from("design_audit_verifications").insert({component_id:componentId,verification_type:checkType,result:checkResult,notes:checkNotes.trim(),reference_url:referenceUrl.trim()||null,pull_request_url:pr.trim()||null,commit_sha:sha.trim()||null});
    setSaving(false);if(issue){setError(issue.message);return;}setCheckNotes("");setReferenceUrl("");setPr("");setSha("");await load();
  }
  const field="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)]";
  const label="block text-sm font-medium";
  const button="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)] disabled:opacity-50";
  if(busy)return <p className="mt-4 text-sm text-[var(--muted)]" role="status">{fr?"Chargement du suivi…":"Loading maintenance records…"}</p>;
  return <div className="mt-5 space-y-5">
    {error&&<p role="alert" className="rounded-xl border border-[var(--danger)] p-3 text-sm">{error}</p>}
    <section className="rounded-2xl border border-[var(--border)] p-4">
      <h3 className="text-lg font-semibold">{fr?"Signalements":"Reports"} ({reports.length})</h3>
      {!reports.length&&<p className="mt-2 text-sm text-[var(--muted)]">{fr?"Aucun signalement pour ce composant.":"No reports for this component."}</p>}
      <div className="divide-y divide-[var(--border)]">{reports.map(r=><article key={r.id} className="py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between"><div className="min-w-0 flex-1">
          <h4 className="font-semibold">{r.title}</h4><p className="mt-1 whitespace-pre-wrap text-sm">{r.description}</p>
          {r.expected_behavior&&<p className="mt-2 text-sm text-[var(--muted)]">{fr?"Attendu : ":"Expected: "}{r.expected_behavior}</p>}
          <p className="mt-2 text-xs text-[var(--muted)]">{labelValue(r.issue_type)} · {labelValue(r.component_state)} · {labelValue(r.severity)} · {new Date(r.created_at).toLocaleString(locale)}</p>
        </div><label className={label}>{fr?"Statut":"Status"}<select className={field} value={r.status} onChange={e=>void changeStatus(r.id,e.target.value)}>{statuses.map(s=><option key={s} value={s}>{labelValue(s)}</option>)}</select></label></div>
      </article>)}</div>
    </section>
    <details className="rounded-2xl border border-[var(--border)] p-4"><summary className="cursor-pointer text-lg font-semibold">{fr?"Signaler un défaut ou un doute":"Report a defect or concern"}</summary>
      <form onSubmit={submitReport} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>{fr?"Résumé":"Summary"}<input className={field} required minLength={3} maxLength={160} value={title} onChange={e=>setTitle(e.target.value)}/></label>
        <label className={label}>{fr?"Type de problème":"Issue type"}<select className={field} value={kind} onChange={e=>setKind(e.target.value)}>{["visual","behavior","accessibility","theme","content","other"].map(x=><option key={x} value={x}>{labelValue(x)}</option>)}</select></label>
        <label className={label}>{fr?"État concerné":"Affected state"}<select className={field} value={state} onChange={e=>setState(e.target.value)}>{["general","default","hover","focus","pressed","disabled","selected","expanded","loading","error","other"].map(x=><option key={x} value={x}>{labelValue(x)}</option>)}</select></label>
        <label className={label}>{fr?"Priorité":"Priority"}<select className={field} value={severity} onChange={e=>setSeverity(e.target.value)}>{["low","normal","high","blocker"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className={label+" sm:col-span-2"}>{fr?"Ce que tu observes":"What you observed"}<textarea className={field} rows={4} required minLength={3} maxLength={10000} value={description} onChange={e=>setDescription(e.target.value)}/></label>
        <label className={label+" sm:col-span-2"}>{fr?"Comportement attendu (facultatif)":"Expected behavior (optional)"}<textarea className={field} rows={2} maxLength={10000} value={expected} onChange={e=>setExpected(e.target.value)}/></label>
        <div><button className={button} disabled={saving}>{saving?(fr?"Enregistrement…":"Saving…"):(fr?"Enregistrer le signalement":"Save report")}</button></div>
      </form>
    </details>
    <section className="rounded-2xl border border-[var(--border)] p-4"><h3 className="text-lg font-semibold">{fr?"Décisions":"Decisions"} ({decisions.length})</h3>
      {decisions.map(d=><article key={d.id} className="border-b border-[var(--border)] py-3"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h4 className="font-semibold">{d.title}</h4><p className="mt-1 whitespace-pre-wrap text-sm">{d.rationale}</p>{d.official_references?.length>0&&<div className="mt-2 flex flex-wrap gap-3 text-sm">{d.official_references.map((ref,i)=>ref.url&&<a key={i} className="underline" href={ref.url} target="_blank" rel="noreferrer">{ref.label||ref.url}</a>)}</div>}</div><label className={label}>{fr?"Statut de décision":"Decision status"}<select className={field} value={d.status} onChange={e=>void changeDecisionStatus(d.id,e.target.value)}>{["proposed","approved","rejected","superseded"].map(s=><option key={s} value={s}>{labelValue(s)}</option>)}</select></label></div></article>)}
      <details className="mt-4 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer font-medium">{fr?"Consigner une décision ou proposition":"Record a decision or proposal"}</summary>
        <form onSubmit={submitDecision} className="mt-3 grid gap-3"><label className={label}>{fr?"Résumé":"Summary"}<input className={field} required minLength={3} maxLength={200} value={decisionTitle} onChange={e=>setDecisionTitle(e.target.value)}/></label>
        <label className={label}>{fr?"Raisonnement et contexte":"Rationale and context"}<textarea className={field} rows={3} required minLength={3} maxLength={10000} value={decisionRationale} onChange={e=>setDecisionRationale(e.target.value)}/></label><label className={label}>{fr?"Référence M3 officielle (facultatif)":"Official M3 reference (optional)"}<input className={field} type="url" pattern="https://.*" value={decisionReference} onChange={e=>setDecisionReference(e.target.value)}/></label><div><button className={button} disabled={saving}>{fr?"Enregistrer la proposition":"Save proposal"}</button></div></form>
      </details>
    </section>
    <section className="rounded-2xl border border-[var(--border)] p-4"><h3 className="text-lg font-semibold">{fr?"Vérifications":"Verifications"} ({checks.length})</h3>
      {checks.map(c=><article key={c.id} className="border-b border-[var(--border)] py-3"><h4 className="font-semibold">{labelValue(c.verification_type)} · {labelValue(c.result)}</h4><p className="mt-1 whitespace-pre-wrap text-sm">{c.notes}</p>{c.reference_url&&<a className="mt-1 inline-block text-sm underline" href={c.reference_url} target="_blank" rel="noreferrer">{fr?"Référence officielle":"Official reference"}</a>}<p className="mt-1 text-xs text-[var(--muted)]">{new Date(c.created_at).toLocaleString(locale)}{c.commit_sha?" · "+c.commit_sha:""}</p>{c.pull_request_url&&<a className="text-sm underline" href={c.pull_request_url} target="_blank" rel="noreferrer">PR</a>}</article>)}
      <details className="mt-4 border-t border-[var(--border)] pt-4"><summary className="cursor-pointer font-medium">{fr?"Consigner une vérification":"Record a verification"}</summary>
        <form onSubmit={submitCheck} className="mt-3 grid gap-3 sm:grid-cols-2"><label className={label}>{fr?"Type":"Type"}<select className={field} value={checkType} onChange={e=>setCheckType(e.target.value)}>{["source-review","visual","interaction","accessibility","automated-test","manual-test","other"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className={label}>{fr?"Résultat":"Result"}<select className={field} value={checkResult} onChange={e=>setCheckResult(e.target.value)}>{["pass","fail","inconclusive"].map(x=><option key={x}>{x}</option>)}</select></label>
        <label className={label+" sm:col-span-2"}>{fr?"Observations et preuves":"Observations and evidence"}<textarea className={field} rows={3} required minLength={3} maxLength={10000} value={checkNotes} onChange={e=>setCheckNotes(e.target.value)}/></label>
        <label className={label}>{fr?"Référence officielle":"Official reference"}<input className={field} type="url" pattern="https://.*" value={referenceUrl} onChange={e=>setReferenceUrl(e.target.value)}/></label><label className={label}>{fr?"URL de la PR":"Pull request URL"}<input className={field} type="url" pattern="https://github\.com/.*" value={pr} onChange={e=>setPr(e.target.value)}/></label>
        <label className={label}>{fr?"SHA du commit":"Commit SHA"}<input className={field} pattern="[0-9a-fA-F]{7,40}" value={sha} onChange={e=>setSha(e.target.value)}/></label><div className="sm:col-span-2"><button className={button} disabled={saving}>{fr?"Enregistrer la vérification":"Save verification"}</button></div></form>
      </details>
    </section>
    <section className="rounded-2xl border border-[var(--border)] p-4"><h3 className="text-lg font-semibold">{fr?"Historique":"History"}</h3>
      {!events.length&&<p className="mt-2 text-sm text-[var(--muted)]">{fr?"Aucun événement enregistré.":"No events recorded."}</p>}
      <ol className="mt-3 space-y-3">{events.map(e=><li key={e.id} className="border-l-2 border-[var(--outline-variant)] pl-3"><p className="font-medium">{e.details?.title||e.event_type}</p><p className="text-xs text-[var(--muted)]">{e.event_type} · {new Date(e.created_at).toLocaleString(locale)}{e.details?.old_status||e.details?.new_status?" · "+(e.details.old_status??"—")+" → "+(e.details.new_status??"—"):""}</p></li>)}</ol>
    </section>
  </div>;
}
