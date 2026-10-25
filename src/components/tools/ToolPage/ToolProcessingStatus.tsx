import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { isToolProcessingDescriptionFallback, type ToolProcessingMetadata } from "@/lib/tools/types";
import { getToolProcessingPresentation } from "@/lib/tools/processing";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ToolProcessingStatus({
  processing,
  locale = "fr",
}: {
  processing: ToolProcessingMetadata;
  locale?: Locale;
}) {
  const t = getMessages(locale).processing;
  const presentation = getToolProcessingPresentation(processing, locale);
  const isDescriptionFallback = isToolProcessingDescriptionFallback(processing, locale);
  const statusTone =
    processing.mode === "local"
      ? "success"
      : processing.mode === "hybrid"
        ? "warning"
        : "info";

  const toneClasses = {
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  } as const;

  return (
    <section className="w-full" aria-label={t.ariaLabel}>
      <details className="group">
        <summary className="m3-type-label-medium flex min-h-9 w-fit max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-[var(--foreground)] outline-none transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
          <span className={"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] " + toneClasses[statusTone]} aria-hidden="true">
            <MaterialIcon name={presentation.icon} size={14} />
          </span>
          <span>{presentation.label}</span>
          <span className="text-[var(--muted)]" aria-hidden="true"><MaterialIcon name="info" size={16} /></span>
        </summary>
        <div className="m3-type-body-medium mt-2 w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-[var(--muted)] shadow-[var(--shadow-sm)]">
          <p className="text-[var(--foreground)]">{processing.description[locale] ?? processing.description.en}</p>
          {isDescriptionFallback && (
            <p className="m3-type-label-medium mt-2 text-[var(--muted)]" role="status">
              {t.fallbackNotice}
            </p>
          )}
          {processing.mode === "local" ? (
            <p className="mt-3 border-t border-[var(--border)] pt-3">
              {t.localDetail}
            </p>
          ) : (
            <div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
              <p>{t.storage}: <strong className="text-[var(--foreground)]">{processing.storage}</strong></p>
              <p>{t.retention}: <strong className="text-[var(--foreground)]">{processing.retention}</strong></p>
              {processing.externalProviders.length > 0 && <p className="sm:col-span-2">{t.externalProviders}: <strong className="text-[var(--foreground)]">{processing.externalProviders.join(", ")}</strong></p>}
              {processing.dataCategories.length > 0 && <p className="sm:col-span-2">{t.dataCategories}: <strong className="text-[var(--foreground)]">{processing.dataCategories.join(", ")}</strong></p>}
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
