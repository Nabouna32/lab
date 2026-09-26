import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import type { ToolProcessingMetadata } from "@/lib/tools/types";
import { getToolProcessingPresentation } from "@/lib/tools/processing";

export default function ToolProcessingStatus({
  processing,
  locale = "fr",
}: {
  processing: ToolProcessingMetadata;
  locale?: Locale;
}) {
  const t = getMessages(locale).processing;
  const presentation = getToolProcessingPresentation(processing, locale);
  const statusTone =
    processing.mode === "local"
      ? "success"
      : processing.mode === "hybrid"
        ? "warning"
        : "info";

  const toneClasses = {
    success: "text-[var(--success)]",
    info: "text-[var(--info)]",
    warning: "text-[var(--warning)]",
  } as const;

  return (
    <section className="relative shrink-0" aria-label={t.ariaLabel}>
      <div className="group relative flex w-max max-w-full items-center gap-1.5 py-1 text-xs font-semibold text-[var(--muted)] sm:text-sm">
        <span
          className={"text-[13px] " + toneClasses[statusTone]}
          aria-hidden="true"
        >
          {presentation.icon}
        </span>
        <span>{presentation.label}</span>

        <button
          type="button"
          className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-[var(--muted)] outline-none transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          aria-describedby="tool-processing-tooltip"
          aria-label={t.more}
        >
          <span aria-hidden="true">i</span>
          <span
            id="tool-processing-tooltip"
            role="tooltip"
            className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-[min(28rem,calc(100vw-2rem))] translate-y-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3.5 py-2.5 text-left text-xs font-normal leading-5 text-[var(--foreground)] opacity-0 shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:text-sm"
          >
            {presentation.summary}
          </span>
        </button>
      </div>
    </section>
  );
}
