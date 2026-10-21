import Link from "next/link";
import { MaterialIcon, type MaterialIconName } from "@/components/ui/MaterialIcon";
import type { Locale } from "@/lib/i18n/config";
import { getToolContent, isPublishedTool, type ToolId } from "@/lib/tools/types";
import { getToolById } from "@/lib/tools/catalog";
import { getToolPath, getToolsPath } from "@/lib/tools/routes";

type Localized = Record<Locale, string>;
type GuidedWorkflow = {
  id: string;
  icon: MaterialIconName;
  title: Localized;
  summary: Localized;
  outcome: Localized;
  transfer: "automatic" | "manual";
  steps: Array<{ toolId: ToolId; description: Localized }>;
};

export const guidedWorkflows: readonly GuidedWorkflow[] = [
  {
    id: "clean-and-compare",
    icon: "swap_horiz",
    title: { fr: "Nettoyer puis comparer une liste", en: "Clean a list, then compare it" },
    summary: {
      fr: "Supprimez les doublons et remettez vos lignes en ordre avant de repérer ce qui a changé entre deux versions.",
      en: "Remove duplicates and sort your lines before spotting what changed between two versions.",
    },
    outcome: {
      fr: "Une comparaison lisible des lignes ajoutées, supprimées ou inchangées.",
      en: "A readable comparison of added, removed, and unchanged lines.",
    },
    transfer: "automatic",
    steps: [
      { toolId: "text-line-processor", description: { fr: "Nettoyez, triez ou dédupliquez votre liste.", en: "Clean, sort, or deduplicate your list." } },
      { toolId: "text-diff-checker", description: { fr: "Le résultat nettoyé est transmis automatiquement. Ajoutez l’autre version pour voir les différences.", en: "The cleaned result is transferred automatically. Add the other version to see the differences." } },
    ],
  },
  {
    id: "prepare-json",
    icon: "apps",
    title: { fr: "Préparer et comparer du JSON", en: "Prepare and compare JSON" },
    summary: {
      fr: "Rendez des données JSON lisibles, puis comparez deux versions pour comprendre les changements.",
      en: "Make JSON data readable, then compare two versions to understand the changes.",
    },
    outcome: {
      fr: "Des données formatées et une vue des différences entre les deux versions.",
      en: "Formatted data and a view of the differences between both versions.",
    },
    transfer: "manual",
    steps: [
      { toolId: "json-formatter", description: { fr: "Formatez et vérifiez la structure de chaque document JSON.", en: "Format and validate the structure of each JSON document." } },
      { toolId: "json-diff-checker", description: { fr: "Collez les deux versions pour localiser les changements.", en: "Paste both versions to locate the changes." } },
    ],
  },
  {
    id: "convert-tabular-data",
    icon: "apps",
    title: { fr: "Convertir un tableau en JSON", en: "Convert a table to JSON" },
    summary: {
      fr: "Transformez des données CSV en JSON, puis rendez le résultat plus facile à relire et à vérifier.",
      en: "Turn CSV data into JSON, then make the result easier to read and verify.",
    },
    outcome: {
      fr: "Un JSON formaté, prêt à être copié vers votre prochain outil ou projet.",
      en: "Formatted JSON, ready to copy into your next tool or project.",
    },
    transfer: "manual",
    steps: [
      { toolId: "csv-json-converter", description: { fr: "Importez ou collez le CSV et choisissez la conversion CSV → JSON.", en: "Import or paste the CSV and choose CSV → JSON." } },
      { toolId: "json-formatter", description: { fr: "Collez le JSON obtenu pour le formater et contrôler sa validité.", en: "Paste the resulting JSON to format it and check its validity." } },
    ],
  },
  {
    id: "prepare-photo-document",
    icon: "image",
    title: { fr: "Préparer des photos pour un PDF", en: "Prepare photos for a PDF" },
    summary: {
      fr: "Vérifiez les informations utiles de vos images, puis rassemblez-les dans un document multipage.",
      en: "Check useful image details, then combine them into a multi-page document.",
    },
    outcome: {
      fr: "Un PDF multipage généré localement à partir de vos photos.",
      en: "A multi-page PDF generated locally from your photos.",
    },
    transfer: "manual",
    steps: [
      { toolId: "image-metadata", description: { fr: "Vérifiez les dimensions et les métadonnées avant de préparer le document.", en: "Check dimensions and metadata before preparing the document." } },
      { toolId: "image-to-pdf", description: { fr: "Ajoutez les photos, réordonnez les pages et exportez le PDF.", en: "Add photos, reorder pages, and export the PDF." } },
    ],
  },
];

const pageCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  description: string;
  privacy: string;
  steps: string;
  outcome: string;
  automatic: string;
  manual: string;
  openTools: string;
}> = {
  fr: {
    eyebrow: "Partir du résultat, pas du nom de l’outil",
    title: "Des parcours pour aller jusqu’au bout",
    description: "Certaines tâches demandent plusieurs étapes. Choisissez votre objectif : chaque parcours vous guide vers les bons outils, dans le bon ordre, sans compte.",
    privacy: "Les outils de ces parcours traitent les données localement dans votre navigateur.",
    steps: "étapes",
    outcome: "À la fin",
    automatic: "Le résultat passe automatiquement à l’étape suivante.",
    manual: "Copiez le résultat dans l’étape suivante lorsque c’est nécessaire.",
    openTools: "Voir tous les outils",
  },
  en: {
    eyebrow: "Start with the outcome, not the tool name",
    title: "Guided paths from start to finish",
    description: "Some tasks take more than one step. Choose your goal: each path guides you to the right tools in the right order, without an account.",
    privacy: "Tools in these paths process data locally in your browser.",
    steps: "steps",
    outcome: "What you get",
    automatic: "The result is passed automatically to the next step.",
    manual: "Copy the result into the next step when needed.",
    openTools: "Browse all tools",
  },
};

export default function GuidedWorkflowsPage({ locale }: { locale: Locale }) {
  const copy = pageCopy[locale];
  const availableWorkflows = guidedWorkflows
    .map((workflow) => ({
      ...workflow,
      steps: workflow.steps.map((step) => ({ ...step, tool: getToolById(step.toolId) })),
    }))
    .filter((workflow) => workflow.steps.every((step) => step.tool && isPublishedTool(step.tool)));

  return (
    <main className="min-h-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[var(--content-wide)]">
        <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)] sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">{copy.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">{copy.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{copy.description}</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
              <MaterialIcon name="lock" size={18} />
              {copy.privacy}
            </p>
          </div>
        </header>

        <section className="mt-6 grid gap-4 lg:grid-cols-2" aria-label={copy.title} data-testid="guided-workflows">
          {availableWorkflows.map((workflow, workflowIndex) => (
            <article key={workflow.id} className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
              <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <MaterialIcon name={workflow.icon} size={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{String(workflowIndex + 1).padStart(2, "0")} · {workflow.steps.length} {copy.steps}</p>
                    <h2 className="mt-1 text-xl font-black tracking-[-0.035em]">{workflow.title[locale]}</h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{workflow.summary[locale]}</p>
                  </div>
                </div>

                <ol className="mt-5 space-y-3">
                  {workflow.steps.map((step, index) => {
                    if (!step.tool) return null;
                    const toolContent = getToolContent(step.tool, locale);
                    return (
                      <li key={step.toolId} className="relative flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-container)] text-xs font-black">{index + 1}</span>
                        <div className="min-w-0 flex-1 pb-1">
                          <Link href={getToolPath(locale, step.toolId)} className="font-bold underline decoration-[var(--outline-variant)] underline-offset-4 hover:decoration-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{toolContent.name}</Link>
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.description[locale]}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 rounded-xl bg-[var(--surface-container-low)] px-3 py-2 text-xs leading-5 text-[var(--muted)]">
                  <MaterialIcon name={workflow.transfer === "automatic" ? "stars" : "content_copy"} size={15} className="mr-1 inline-block align-[-2px]" />
                  {workflow.transfer === "automatic" ? copy.automatic : copy.manual}
                </p>
              </div>
              <div className="border-t border-[var(--border)] bg-[var(--surface-container-low)] px-5 py-4 sm:px-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{copy.outcome}</p>
                <p className="mt-1 text-sm font-semibold">{workflow.outcome[locale]}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6 flex justify-center">
          <Link href={getToolsPath(locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-bold transition-colors hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            {copy.openTools}<MaterialIcon name="arrow_forward" size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
