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
                    <h2 className="mt-1 text-xl font-black tracking-[-0.035em]">{workflow.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{workflow.summary}</p>
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
                          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{step.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-4 rounded-xl bg-[var(--surface-container-low)] px-3 py-2 text-xs leading-5 text-[var(--muted)]">
                  <MaterialIcon name={workflow.transfer === "automatic" ? "stars" : workflow.transfer === "manual" ? "content_copy" : "info"} size={15} className="mr-1 inline-block align-[-2px]" />
                  {workflow.transfer === "automatic" ? copy.automatic : workflow.transfer === "manual" ? copy.manual : copy.independent}
                </p>
              </div>
              <div className="border-t border-[var(--border)] bg-[var(--surface-container-low)] px-5 py-4 sm:px-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{copy.outcome}</p>
                <p className="mt-1 text-sm font-semibold">{workflow.outcome}</p>
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
