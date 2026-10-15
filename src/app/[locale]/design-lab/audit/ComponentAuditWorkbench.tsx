"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  auditStatusLabels,
  historicalAuditLeads,
  m3ComponentAuditRegistry,
  type AuditStatus,
} from "@/lib/design-system/m3-component-audit";
import styles from "./component-audit.module.css";

type Locale = "fr" | "en";
const statuses: AuditStatus[] = [
  "unverified",
  "partially-verified",
  "discrepancy-confirmed",
  "verification-required",
  "conformant-within-verified-scope",
];

const copy = {
  fr: {
    eyebrow: "Matériel 3 Fidelity · registre de travail",
    title: "Audit des composants",
    intro: "Un registre pour préparer l’audit, garder les preuves et documenter les décisions. La présence d’un composant ici — ou dans la galerie — ne prouve jamais sa conformité.",
    back: "← Retour au laboratoire visuel",
    catalog: "Catalogue des composants",
    catalogHelp: "Chaque composant sera étudié individuellement avec discussion et validation avant toute modification de production.",
    search: "Rechercher un composant",
    searchPlaceholder: "Ex. Button, NavigationBar…",
    category: "Famille",
    allCategories: "Toutes les familles",
    status: "Statut",
    allStatuses: "Tous les statuts",
    total: "Entrées au registre",
    unverified: "Non vérifiés",
    proven: "Composants conformes",
    provenValue: "0",
    historical: "Pistes historiques à revalider",
    historicalHelp: "Ces points viennent de l’ancien audit Markdown. Ce sont des pistes, pas des conclusions actuelles : elles doivent être réexaminées avec le code et les sources.",
    facts: "Constats vérifiés",
    factsEmpty: "Aucun constat vérifié enregistré.",
    discrepancies: "Écarts confirmés",
    discrepanciesEmpty: "Aucun écart confirmé enregistré.",
    questions: "Questions et vérifications restantes",
    questionsEmpty: "À définir pendant l’audit individuel.",
    sources: "Fichiers source",
    sourcesEmpty: "Pas encore reliés — à établir à partir du code réel.",
    refs: "Références officielles",
    refsEmpty: "Pas encore documentées.",
    usage: "Usage en production",
    unknown: "Inconnu — ne pas déduire de la galerie.",
    type: "Type d’implémentation",
    typeValue: "Non classé",
    verification: "Vérifications exécutées",
    verificationEmpty: "Aucune. Le statut reste « non vérifié ».",
    decisions: "Décisions validées",
    decisionsEmpty: "Aucune décision produit ou technique validée.",
    history: "Historique",
    historyEmpty: "Aucun historique enregistré.",
    empty: "Aucun composant ne correspond aux filtres.",
    lead: "Piste historique",
    oldSource: "Source historique",
    statusLabels: auditStatusLabels,
    reset: "Réinitialiser les filtres",
  },
  en: {
    eyebrow: "Material 3 Fidelity · working register",
    title: "Component audit",
    intro: "A register for preparing audits, preserving evidence and documenting decisions. A component appearing here—or in the gallery—never proves conformance.",
    back: "← Back to the visual lab",
    catalog: "Component catalog",
    catalogHelp: "Each component will be examined individually, with discussion and approval before any production change.",
    search: "Search components",
    searchPlaceholder: "e.g. Button, NavigationBar…",
    category: "Family",
    allCategories: "All families",
    status: "Status",
    allStatuses: "All statuses",
    total: "Registry entries",
    unverified: "Unverified",
    proven: "Conformant components",
    provenValue: "0",
    historical: "Historical leads to revalidate",
    historicalHelp: "These points come from the previous Markdown audit. They are leads, not current conclusions: review them against code and sources.",
    facts: "Verified observations",
    factsEmpty: "No verified observations recorded.",
    discrepancies: "Confirmed discrepancies",
    discrepanciesEmpty: "No confirmed discrepancies recorded.",
    questions: "Open questions and remaining checks",
    questionsEmpty: "To be defined during the individual audit.",
    sources: "Source files",
    sourcesEmpty: "Not linked yet — establish from the actual code.",
    refs: "Official references",
    refsEmpty: "Not documented yet.",
    usage: "Production usage",
    unknown: "Unknown — do not infer from the gallery.",
    type: "Implementation type",
    typeValue: "Unclassified",
    verification: "Executed verification",
    verificationEmpty: "None. Status remains “unverified”.",
    decisions: "Approved decisions",
    decisionsEmpty: "No approved product or technical decisions.",
    history: "History",
    historyEmpty: "No history recorded.",
    empty: "No components match these filters.",
    lead: "Historical lead",
    oldSource: "Historical source",
    statusLabels: auditStatusLabels,
    reset: "Reset filters",
  },
};

export default function ComponentAuditWorkbench({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<"all" | AuditStatus>("all");

  const categories = useMemo(
    () => Array.from(new Set(m3ComponentAuditRegistry.map((component) => component.category))),
    [],
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    return m3ComponentAuditRegistry.filter((component) => {
      const matchesQuery = !normalized
        || component.name.toLocaleLowerCase(locale).includes(normalized)
        || component.category.toLocaleLowerCase(locale).includes(normalized);
      return matchesQuery
        && (category === "all" || component.category === category)
        && (status === "all" || component.status === status);
    });
  }, [category, locale, query, status]);

  const verifiedCount = m3ComponentAuditRegistry.filter(
    (component) => component.status === "conformant-within-verified-scope",
  ).length;

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <Link className={styles.backLink} href={`/${locale}/design-lab`}>{t.back}</Link>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className={styles.intro}>{t.intro}</p>
      </header>

      <section className={styles.metrics} aria-label={locale === "fr" ? "État du registre" : "Registry status"}>
        <article className={styles.metric}><span>{t.total}</span><strong>{m3ComponentAuditRegistry.length}</strong></article>
        <article className={styles.metric}><span>{t.unverified}</span><strong>{m3ComponentAuditRegistry.filter((item) => item.status === "unverified").length}</strong></article>
        <article className={styles.metric}><span>{t.proven}</span><strong>{verifiedCount}</strong></article>
      </section>

      <section className={styles.catalog} aria-labelledby="component-catalog-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>{locale === "fr" ? "Registre canonique structuré" : "Structured canonical register"}</p><h2 id="component-catalog-title">{t.catalog}</h2><p>{t.catalogHelp}</p></div>
        </div>
        <div className={styles.filters}>
          <label>{t.search}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} /></label>
          <label>{t.category}<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">{t.allCategories}</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>{t.status}<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">{t.allStatuses}</option>{statuses.map((item) => <option key={item} value={item}>{t.statusLabels[item][locale]}</option>)}</select></label>
          <button className={styles.reset} type="button" onClick={() => { setQuery(""); setCategory("all"); setStatus("all"); }}>{t.reset}</button>
        </div>

        <p className={styles.resultCount}>{locale === "fr" ? `${filtered.length} composant(s) affiché(s)` : `${filtered.length} component(s) shown`}</p>
        <div className={styles.componentList}>
          {filtered.map((component) => (
            <details className={styles.component} key={component.id}>
              <summary>
                <span className={styles.componentName}>{component.name}</span>
                <span className={styles.componentCategory}>{component.category}</span>
                <span className={styles.status} data-status={component.status}>{t.statusLabels[component.status][locale]}</span>
              </summary>
              <div className={styles.detailsGrid}>
                <section><h3>{t.type}</h3><p>{t.typeValue}</p></section>
                <section><h3>{t.usage}</h3><p>{t.unknown}</p></section>
                <section><h3>{t.sources}</h3>{component.sourceFiles.length ? <ul>{component.sourceFiles.map((file) => <li key={file}><code>{file}</code></li>)}</ul> : <p>{t.sourcesEmpty}</p>}</section>
                <section><h3>{t.refs}</h3>{component.officialReferences.length ? <ul>{component.officialReferences.map((ref) => <li key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.label}</a></li>)}</ul> : <p>{t.refsEmpty}</p>}</section>
                <section><h3>{t.facts}</h3>{component.observedFacts.length ? <ul>{component.observedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul> : <p>{t.factsEmpty}</p>}</section>
                <section><h3>{t.discrepancies}</h3>{component.confirmedDiscrepancies.length ? <ul>{component.confirmedDiscrepancies.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{t.discrepanciesEmpty}</p>}</section>
                <section><h3>{t.questions}</h3>{component.unverifiedQuestions.length ? <ul>{component.unverifiedQuestions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{t.questionsEmpty}</p>}</section>
                <section><h3>{t.verification}</h3><p>{t.verificationEmpty}</p></section>
                <section><h3>{t.decisions}</h3>{component.decisions.length ? <ul>{component.decisions.map((item) => <li key={item}>{item}</li>)}</ul> : <p>{t.decisionsEmpty}</p>}</section>
                <section><h3>{t.history}</h3>{component.history.length ? <ul>{component.history.map((item, index) => <li key={`${item.date}-${index}`}>{item.date}: {item.note}</li>)}</ul> : <p>{t.historyEmpty}</p>}</section>
              </div>
            </details>
          ))}
          {filtered.length === 0 && <p className={styles.empty}>{t.empty}</p>}
        </div>
      </section>

      <section className={styles.leads} aria-labelledby="historical-leads-title">
        <p className={styles.eyebrow}>{locale === "fr" ? "Mémoire de l’audit précédent" : "Previous audit context"}</p>
        <h2 id="historical-leads-title">{t.historical}</h2>
        <p>{t.historicalHelp}</p>
        <div className={styles.leadList}>
          {historicalAuditLeads.map((lead) => (
            <article className={styles.lead} key={lead.id}>
              <span className={styles.historicalBadge}>{t.lead}</span>
              <h3>{lead.title[locale]} · {lead.component}</h3>
              <p>{lead.note[locale]}</p>
              <p className={styles.sourceNote}>{t.oldSource}: <code>{lead.source}</code></p>
            </article>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        {locale === "fr"
          ? "Lot A — structure initiale uniquement. Aucun composant de production n’a été modifié ; les fiches seront complétées pendant les audits individuels."
          : "Lot A — initial structure only. No production component was changed; records will be completed during individual audits."}
      </footer>
    </main>
  );
}
