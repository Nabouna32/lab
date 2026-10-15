"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ComponentLivePreview from "./ComponentLivePreview";
import ComponentMaintenancePanel from "./ComponentMaintenancePanel";

type Locale = "fr" | "en";
type AuditStatus =
  | "unverified"
  | "partially-verified"
  | "discrepancy-confirmed"
  | "verification-required"
  | "conformant-within-verified-scope";
type CatalogScope = "material-3" | "loculary";
type CatalogEntryType = "component" | "variant" | "pattern" | "api-concept" | "utility" | "composition";
type ReferenceStatus = "unverified" | "verified" | "not-applicable";

type CatalogEntry = {
  id: string;
  name: string;
  category: string;
  catalog_scope: CatalogScope;
  entry_type: CatalogEntryType;
  classification_note: string;
  reference_status: ReferenceStatus;
  official_reference_url: string | null;
  implementation_component_id: string | null;
  sort_order: number;
};
type Component = {
  id: string;
  name: string;
  category: string;
  implementation_path: string;
  preview_key: string | null;
  audit_status: AuditStatus;
  m3_relationship: "web-adaptation" | "loculary-utility" | "not-assessed";
  official_references: { label?: string; url?: string }[];
};
type ReportSummary = { id: string; component_id: string; status: string };

const statusOptions: AuditStatus[] = [
  "unverified",
  "partially-verified",
  "discrepancy-confirmed",
  "verification-required",
  "conformant-within-verified-scope",
];
const statusLabels: Record<AuditStatus, { fr: string; en: string }> = {
  unverified: { fr: "Non vérifié", en: "Unverified" },
  "partially-verified": { fr: "Partiellement vérifié", en: "Partially verified" },
  "discrepancy-confirmed": { fr: "Écart confirmé", en: "Confirmed discrepancy" },
  "verification-required": { fr: "Vérification requise", en: "Verification required" },
  "conformant-within-verified-scope": { fr: "Conforme dans le périmètre vérifié", en: "Conformant within verified scope" },
};
const typeLabels: Record<CatalogEntryType, { fr: string; en: string }> = {
  component: { fr: "Composant", en: "Component" },
  variant: { fr: "Variante", en: "Variant" },
  pattern: { fr: "Pattern / structure", en: "Pattern / structure" },
  "api-concept": { fr: "Concept d’API", en: "API concept" },
  utility: { fr: "Utilitaire Loculary", en: "Loculary utility" },
  composition: { fr: "Composition Loculary", en: "Loculary composition" },
};
const relationshipLabels: Record<Component["m3_relationship"], { fr: string; en: string }> = {
  "web-adaptation": { fr: "Adaptation Web M3 / AndroidX", en: "M3 / AndroidX web adaptation" },
  "loculary-utility": { fr: "Spécifique à Loculary", en: "Loculary-specific" },
  "not-assessed": { fr: "Relation à qualifier", en: "Relationship to classify" },
};

export default function ComponentAuditWorkbench({ locale }: { locale: Locale }) {
  const fr = locale === "fr";
  const db = useMemo(() => createClient(), []);
  const [catalog, setCatalog] = useState<CatalogEntry[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [tab, setTab] = useState<CatalogScope>("material-3");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [entryType, setEntryType] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [expandedEntryId, setExpandedEntryId] = useState("");
  const [expandedComponentId, setExpandedComponentId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const [catalogResult, componentResult, reportResult] = await Promise.all([
        db.from("design_audit_catalog_entries")
          .select("id,name,category,catalog_scope,entry_type,classification_note,reference_status,official_reference_url,implementation_component_id,sort_order")
          .order("sort_order"),
        db.from("design_audit_components")
          .select("id,name,category,implementation_path,preview_key,audit_status,m3_relationship,official_references")
          .order("category").order("name"),
        db.from("design_audit_reports").select("id,component_id,status"),
      ]);
      if (!active) return;
      const firstError = catalogResult.error ?? componentResult.error ?? reportResult.error;
      setError(firstError?.message ?? "");
      setCatalog((catalogResult.data ?? []) as CatalogEntry[]);
      setComponents((componentResult.data ?? []) as Component[]);
      setReports((reportResult.data ?? []) as ReportSummary[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, [db]);

  const activeCatalog = useMemo(
    () => catalog.filter((entry) => entry.catalog_scope === tab),
    [catalog, tab],
  );
  const categories = useMemo(
    () => [...new Set(activeCatalog.map((entry) => entry.category))].sort((a, b) => a.localeCompare(b, locale)),
    [activeCatalog, locale],
  );
  const filteredCatalog = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    return activeCatalog.filter((entry) =>
      (!needle || [entry.name, entry.id, entry.category, entry.entry_type, entry.classification_note]
        .some((value) => value.toLocaleLowerCase(locale).includes(needle)))
      && (category === "all" || entry.category === category)
      && (entryType === "all" || entry.entry_type === entryType)
      && (tab !== "material-3" || status === "all" || entry.reference_status === status),
    );
  }, [activeCatalog, query, category, entryType, status, tab, locale]);

  const linkedImplementationIds = useMemo(
    () => new Set(catalog.flatMap((entry) => entry.implementation_component_id ? [entry.implementation_component_id] : [])),
    [catalog],
  );
  const unlinkedImplementations = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale);
    return components.filter((component) =>
      !linkedImplementationIds.has(component.id)
      && (!needle || [component.name, component.id, component.category, component.implementation_path]
        .some((value) => value.toLocaleLowerCase(locale).includes(needle)))
      && (status === "all" || component.audit_status === status),
    );
  }, [components, linkedImplementationIds, query, status, locale]);

  const openReports = reports.filter((report) => !["verified", "wont-fix"].includes(report.status)).length;
  const verifiedReferences = catalog.filter((entry) => entry.catalog_scope === "material-3" && entry.reference_status === "verified").length;
  const provenComponents = components.filter((component) => component.audit_status === "conformant-within-verified-scope").length;

  async function updateAuditStatus(component: Component, audit_status: AuditStatus) {
    setSavingId(component.id);
    setError("");
    setNotice("");
    const { error: updateError } = await db.from("design_audit_components").update({ audit_status }).eq("id", component.id);
    setSavingId("");
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setComponents((current) => current.map((item) => item.id === component.id ? { ...item, audit_status } : item));
    setNotice(fr ? "Statut d’audit enregistré." : "Audit status saved.");
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setEntryType("all");
    setStatus("all");
  }

  const renderImplementationDetails = (component: Component) => (
    <div className="mt-4 border-t border-[var(--border)] pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold">{fr ? "Implémentation Loculary associée" : "Linked Loculary implementation"}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{component.implementation_path}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{relationshipLabels[component.m3_relationship][locale]}</p>
        </div>
        <a className="text-sm font-semibold text-[var(--accent)] underline" href={`https://github.com/Nabouna32/lab/blob/main/${component.implementation_path}`} target="_blank" rel="noreferrer">
          {fr ? "Ouvrir le code source ↗" : "Open source ↗"}
        </a>
      </div>
      <label className="mt-4 block max-w-md text-sm font-medium">
        {fr ? "Statut de l’audit" : "Audit status"}
        <select
          className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
          value={component.audit_status}
          disabled={savingId === component.id}
          onChange={(event) => void updateAuditStatus(component, event.target.value as AuditStatus)}
        >
          {statusOptions.map((value) => <option key={value} value={value}>{statusLabels[value][locale]}</option>)}
        </select>
      </label>
      {component.official_references.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-sm">
          {component.official_references.map((reference, index) => (
            <li key={index}>{reference.url
              ? <a className="underline" href={reference.url} target="_blank" rel="noreferrer">{reference.label || reference.url}</a>
              : reference.label}</li>
          ))}
        </ul>
      )}
      <ComponentLivePreview key={component.id} previewKey={component.preview_key} locale={locale} />
      <ComponentMaintenancePanel key={component.id} componentId={component.id} locale={locale} />
    </div>
  );

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link className="text-sm font-semibold text-[var(--accent)]" href={`/${locale}/design-lab`}>
          {fr ? "← Retour au laboratoire visuel" : "← Back to visual lab"}
        </Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[var(--accent)]">Material 3 Fidelity · Design Lab</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {fr ? "Catalogue & maintenance UI" : "UI catalogue & maintenance"}
            </h1>
            <p className="mt-3 text-[var(--muted)]">
              {fr
                ? "Le référentiel de conception et les implémentations réelles sont séparés : une entrée de catalogue ne prouve ni qu’un composant existe dans Loculary, ni qu’il est conforme."
                : "The design reference and real implementations are kept separate: a catalogue entry proves neither that a component exists in Loculary nor that it conforms."}
            </p>
          </div>
          <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium">
            {fr ? "Espace d’administration" : "Administration workspace"}
          </span>
        </div>
      </header>

      {error && <p role="alert" className="mb-4 rounded-xl border border-[var(--danger)] p-3 text-sm">{error}</p>}
      {notice && <p role="status" className="mb-4 rounded-xl border border-[var(--border)] p-3 text-sm">{notice}</p>}

      <section className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={fr ? "Indicateurs du catalogue" : "Catalogue metrics"}>
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{fr ? "Entrées de référence M3 / AndroidX" : "M3 / AndroidX reference entries"}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{catalog.filter((entry) => entry.catalog_scope === "material-3").length}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{fr ? "Identité et sources à valider" : "Identity and sources to verify"}</p>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{fr ? "Concepts spécifiques Loculary" : "Loculary-specific concepts"}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{catalog.filter((entry) => entry.catalog_scope === "loculary").length}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{fr ? "Utilitaires et compositions" : "Utilities and compositions"}</p>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{fr ? "Implémentations réelles" : "Actual implementations"}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{components.length}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{fr ? "Fichiers UI inventoriés" : "UI source files inventoried"}</p>
        </article>
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--muted)]">{fr ? "Signalements ouverts" : "Open reports"}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{openReports}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{fr ? `${provenComponents} implémentation(s) conforme(s) dans le périmètre vérifié` : `${provenComponents} implementation(s) conformant within verified scope`}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="border-b border-[var(--border)] px-4 pt-4 sm:px-6 sm:pt-6">
          <div role="tablist" aria-label={fr ? "Catalogue de composants" : "Component catalogue"} className="flex flex-wrap gap-2">
            <button
              type="button" role="tab" aria-selected={tab === "material-3"} aria-controls="catalog-panel"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${tab === "material-3" ? "bg-[var(--accent)] text-[var(--on-accent)]" : "border border-[var(--border)] hover:bg-[var(--surface-container)]"}`}
              onClick={() => { setTab("material-3"); setCategory("all"); setEntryType("all"); setStatus("all"); setExpandedEntryId(""); setExpandedComponentId(""); }}
            >
              {fr ? "Référentiel Material 3" : "Material 3 reference"}
              <span className="ml-2 text-xs opacity-80">{catalog.filter((entry) => entry.catalog_scope === "material-3").length}</span>
            </button>
            <button
              type="button" role="tab" aria-selected={tab === "loculary"} aria-controls="catalog-panel"
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${tab === "loculary" ? "bg-[var(--accent)] text-[var(--on-accent)]" : "border border-[var(--border)] hover:bg-[var(--surface-container)]"}`}
              onClick={() => { setTab("loculary"); setCategory("all"); setEntryType("all"); setStatus("all"); setExpandedEntryId(""); setExpandedComponentId(""); }}
            >
              {fr ? "Spécifique à Loculary" : "Loculary-specific"}
              <span className="ml-2 text-xs opacity-80">{catalog.filter((entry) => entry.catalog_scope === "loculary").length}</span>
            </button>
          </div>
          <div className="pb-5 pt-4">
            <h2 className="text-xl font-semibold">{tab === "material-3" ? (fr ? "Référentiel M3 & API AndroidX" : "M3 & AndroidX reference") : (fr ? "Compositions et utilitaires Loculary" : "Loculary compositions and utilities")}</h2>
            <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">
              {tab === "material-3"
                ? (fr
                  ? "Le registre historique est une base de départ, pas une validation officielle exhaustive. Les noms, types et références sont à confirmer au fil de l’audit individuel ; variantes et concepts d’API sont identifiés séparément."
                  : "The historical register is a starting point, not a fully verified official catalogue. Names, types and references must be confirmed during individual audits; variants and API concepts are distinguished.")
                : (fr
                  ? "Ces entrées n’ont pas d’identité de composant Material 3 autonome. Elles peuvent néanmoins composer l’interface avec les tokens et les règles du design system."
                  : "These entries do not have a standalone Material 3 component identity. They may still compose the UI using the design system’s tokens and rules.")}
            </p>
          </div>
        </div>

        <div id="catalog-panel" role="tabpanel" className="p-4 sm:p-6">
          <div className="mb-5 grid gap-3 rounded-2xl border border-[var(--border)] p-4 sm:grid-cols-[minmax(12rem,1.4fr)_minmax(10rem,0.8fr)_minmax(10rem,0.8fr)_auto]">
            <label className="text-sm font-medium">
              {fr ? "Rechercher" : "Search"}
              <input className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={fr ? "Nom, catégorie, type…" : "Name, category, type…"} />
            </label>
            <label className="text-sm font-medium">
              {fr ? "Famille" : "Category"}
              <select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="all">{fr ? "Toutes" : "All"}</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">
              {fr ? "Nature de l’entrée" : "Entry type"}
              <select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm" value={entryType} onChange={(event) => setEntryType(event.target.value)}>
                <option value="all">{fr ? "Tous les types" : "All types"}</option>
                {(tab === "material-3" ? ["component", "variant", "pattern", "api-concept"] : ["utility", "composition"]).map((value) => (
                  <option key={value} value={value}>{typeLabels[value as CatalogEntryType][locale]}</option>
                ))}
              </select>
            </label>
            {tab === "material-3" ? (
              <label className="text-sm font-medium">
                {fr ? "Source" : "Reference"}
                <select className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="all">{fr ? "Tous les états" : "All states"}</option>
                  <option value="unverified">{fr ? "À vérifier" : "Unverified"}</option>
                  <option value="verified">{fr ? "Vérifiée" : "Verified"}</option>
                </select>
              </label>
            ) : (
              <button type="button" className="self-end rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--surface-container)]" onClick={resetFilters}>
                {fr ? "Réinitialiser" : "Reset"}
              </button>
            )}
          </div>

          {loading ? (
            <p role="status" className="py-16 text-center text-sm text-[var(--muted)]">{fr ? "Chargement du catalogue et des implémentations…" : "Loading catalogue and implementations…"}</p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-[var(--muted)]">{fr ? `${filteredCatalog.length} entrée(s) affichée(s)` : `${filteredCatalog.length} entr(y/ies) shown`}</p>
                {tab === "material-3" && <p className="text-xs text-[var(--muted)]">{fr ? `${verifiedReferences} référence(s) vérifiée(s) sur ${activeCatalog.length}` : `${verifiedReferences} verified reference(s) out of ${activeCatalog.length}`}</p>}
              </div>

              {filteredCatalog.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center">
                  <p className="font-medium">{fr ? "Aucune entrée ne correspond aux filtres." : "No entries match these filters."}</p>
                  <button type="button" className="mt-3 text-sm font-semibold text-[var(--accent)] underline" onClick={resetFilters}>{fr ? "Effacer les filtres" : "Clear filters"}</button>
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {filteredCatalog.map((entry) => {
                    const implementation = entry.implementation_component_id ? components.find((item) => item.id === entry.implementation_component_id) : undefined;
                    const expanded = expandedEntryId === entry.id;
                    return (
                      <article key={entry.id} className="min-w-0 rounded-2xl border border-[var(--border)] p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words text-base font-semibold">{entry.name}</h3>
                            <p className="mt-1 text-xs text-[var(--muted)]">{entry.category}</p>
                          </div>
                          <span className="shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs">{typeLabels[entry.entry_type][locale]}</span>
                        </div>
                        <p className="mt-3 text-sm text-[var(--muted)]">{entry.classification_note}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {entry.reference_status === "verified" && entry.official_reference_url ? (
                            <a className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium underline" href={entry.official_reference_url} target="_blank" rel="noreferrer">
                              {fr ? "Référence officielle vérifiée ↗" : "Verified official reference ↗"}
                            </a>
                          ) : entry.reference_status === "not-applicable" ? (
                            <span className="rounded-full bg-[var(--surface-container)] px-3 py-1.5 text-xs">{fr ? "Hors catalogue M3" : "Outside M3 catalogue"}</span>
                          ) : (
                            <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs">{fr ? "Identité / source à vérifier" : "Identity / source to verify"}</span>
                          )}
                          {implementation && <span className="rounded-full bg-[var(--surface-container)] px-3 py-1.5 text-xs">{fr ? "Implémentation liée" : "Linked implementation"}</span>}
                        </div>
                        {implementation ? (
                          <button type="button" className="mt-4 text-sm font-semibold text-[var(--accent)] underline" aria-expanded={expanded} onClick={() => setExpandedEntryId(expanded ? "" : entry.id)}>
                            {expanded ? (fr ? "Masquer l’implémentation" : "Hide implementation") : (fr ? "Inspecter l’implémentation réelle" : "Inspect real implementation")}
                          </button>
                        ) : (
                          <p className="mt-4 text-xs text-[var(--muted)]">{fr ? "Aucune implémentation Loculary directement associée pour l’instant." : "No direct Loculary implementation is linked yet."}</p>
                        )}
                        {expanded && implementation && renderImplementationDetails(implementation)}
                      </article>
                    );
                  })}
                </div>
              )}

              {tab === "loculary" && (
                <section className="mt-8 border-t border-[var(--border)] pt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">{fr ? "Implémentations à rattacher" : "Implementations to map"}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {fr
                        ? "Ces fichiers existent dans l’application, mais aucun lien direct vers une entrée du catalogue n’est enregistré. Ce n’est pas une conclusion sur leur conformité."
                        : "These files exist in the app but have no direct catalogue link recorded. This is not a conformance conclusion."}
                    </p>
                  </div>
                  {unlinkedImplementations.length === 0 ? (
                    <p className="rounded-2xl border border-[var(--border)] p-5 text-sm text-[var(--muted)]">{fr ? "Toutes les implémentations inventoriées sont reliées à une entrée du catalogue." : "All inventoried implementations are linked to a catalogue entry."}</p>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-[var(--muted)]">{fr ? `${unlinkedImplementations.length} implémentation(s) sans lien` : `${unlinkedImplementations.length} unmapped implementation(s)`}</p>
                        <label className="text-sm font-medium">
                          {fr ? "Statut d’audit" : "Audit status"}
                          <select className="ml-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
                            <option value="all">{fr ? "Tous" : "All"}</option>
                            {statusOptions.map((value) => <option key={value} value={value}>{statusLabels[value][locale]}</option>)}
                          </select>
                        </label>
                      </div>
                      {unlinkedImplementations.map((component) => (
                        <article key={component.id} className="rounded-2xl border border-[var(--border)] p-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold">{component.name}</h4>
                              <p className="mt-1 text-xs text-[var(--muted)]">{component.category} · {component.implementation_path}</p>
                              <p className="mt-1 text-xs text-[var(--muted)]">{relationshipLabels[component.m3_relationship][locale]}</p>
                            </div>
                            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{statusLabels[component.audit_status][locale]}</span>
                          </div>
                          <button type="button" className="mt-3 text-sm font-semibold text-[var(--accent)] underline" aria-expanded={expandedComponentId === component.id} onClick={() => setExpandedComponentId(expandedComponentId === component.id ? "" : component.id)}>
                            {expandedComponentId === component.id ? (fr ? "Fermer les détails" : "Close details") : (fr ? "Ouvrir les détails" : "Open details")}
                          </button>
                          {expandedComponentId === component.id && renderImplementationDetails(component)}
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="mt-6 flex flex-col gap-2 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>{fr ? "Les observations, décisions et preuves de vérification restent distinctes. Un statut conforme exige une preuve positive." : "Observations, decisions and verification evidence remain separate. A conformant status requires passing evidence."}</p>
        <p>{fr ? "Références vérifiées : " : "Verified references: "}{verifiedReferences} · {fr ? "Conformité établie : " : "Conformance established: "}{provenComponents}</p>
      </footer>
    </main>
  );
}
