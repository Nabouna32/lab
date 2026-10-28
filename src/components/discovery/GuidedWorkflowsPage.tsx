import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolById } from "@/lib/tools/catalog";
import { getToolContent, isPublishedTool } from "@/lib/tools/types";
import { getToolPath, getToolsPath } from "@/lib/tools/routes";
import { PageContainer } from "@/components/layout/PageLayout";

export default function GuidedWorkflowsPage({ locale }: { locale: Locale }) {
  const copy = getMessages(locale).guidedWorkflows;
  const availableWorkflows = copy.recipes
    .map((workflow) => ({
      ...workflow,
      steps: workflow.steps.map((step) => ({ ...step, tool: getToolById(step.toolId) })),
    }))
    .filter((workflow) => workflow.steps.every((step) => step.tool && isPublishedTool(step.tool)));

  return (
    <main className="min-h-full">
      <PageContainer width="wide" spacing="compact">
        <header className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-lg)] sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
          <div className="relative max-w-3xl">
            <p className="m3-type-label-small text-[var(--primary)]">{copy.eyebrow}</p>
            <h1 className="m3-type-headline-large mt-3">{copy.title}</h1>
            <p className="m3-type-body-large mt-4 max-w-2xl text-[var(--muted)]">{copy.description}</p>
            <p className="m3-type-body-medium mt-4 flex items-center gap-2 text-[var(--muted)]">
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
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--shape-corner-medium)] bg-[var(--primary-container)] text-[var(--on-primary-container)]">
                    <MaterialIcon name={workflow.icon} size={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m3-type-label-small text-[var(--muted)]">{String(workflowIndex + 1).padStart(2, "0")} · {workflow.steps.length} {copy.steps}</p>
                    <h2 className="m3-type-title-large mt-1">{workflow.title}</h2>
                    <p className="m3-type-body-medium mt-2 text-[var(--muted)]">{workflow.summary}</p>
                  </div>
                </div>

                <ol className="mt-5 space-y-3">
                  {workflow.steps.map((step, index) => {
                    if (!step.tool) return null;
                    const toolContent = getToolContent(step.tool, locale);
                    return (
                      <li key={step.toolId} className="relative flex gap-3">
                        <span className="m3-type-label-medium flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--outline-variant)] bg-[var(--surface-container)] text-[var(--on-surface)]">{index + 1}</span>
                        <div className="min-w-0 flex-1 pb-1">
                          <Link href={getToolPath(locale, step.toolId)} className="m3-type-title-medium underline decoration-[var(--outline-variant)] underline-offset-4 hover:decoration-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{toolContent.name}</Link>
                          <p className="m3-type-body-medium mt-1 text-[var(--muted)]">{step.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="m3-type-body-small mt-4 rounded-[var(--shape-corner-small)] bg-[var(--surface-container-low)] px-3 py-2 text-[var(--on-surface-variant)]">
                  <MaterialIcon name={workflow.transfer === "automatic" ? "stars" : workflow.transfer === "manual" ? "content_copy" : "info"} size={15} className="mr-1 inline-block align-[-2px]" />
                  {workflow.transfer === "automatic" ? copy.automatic : workflow.transfer === "manual" ? copy.manual : copy.independent}
                </p>
              </div>
              <div className="border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-5 py-4 sm:px-6">
                <p className="m3-type-label-small text-[var(--on-surface-variant)]">{copy.outcome}</p>
                <p className="m3-type-body-medium mt-1 text-[var(--on-surface)]">{workflow.outcome}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-6 flex justify-center">
          <Link href={getToolsPath(locale)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 text-sm font-bold transition-colors hover:bg-[var(--surface-container)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            {copy.openTools}<MaterialIcon name="arrow_forward" size={18} />
          </Link>
        </div>
      </PageContainer>
    </main>
  );
}
