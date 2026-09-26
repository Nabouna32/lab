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
    success: "bg-[var(--success-soft)] text-[var(--success)]",
    info: "bg-[var(--info-soft)] text-[var(--info)]",
    warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  } as const;

  return (
    <section className="relative shrink-0" aria-label={t.ariaLabel}>
      <details className="group">
        <summary className="flex w-max max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-sm)] outline-none transition-colors hover:border-[var(--accent)]/40 hover:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:text-sm">
          <span
            className={
              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] " +
              toneClasses[statusTone]
            }
            aria-hidden="true"
          >
            {presentation.icon}
          </span>
          <span>{presentation.label}</span>
          <span className="ml-0.5 text-[var(--accent)]" aria-hidden="true">ⓘ</span>
        </summary>

        <div className="absolute right-0 top-full z-20 mt-2 w-[min(30rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 text-sm leading-6 text-[var(--muted)] shadow-[var(--shadow-lg)]">
          <p className="text-[var(--foreground)]">{processing.description[locale] ?? processing.description.fr}</p>

          {processing.mode === "local" ? (
            <p className="mt-3 border-t border-[var(--border)] pt-3">
              {locale === "fr"
                ? "Aucune donnée n'est envoyée à un serveur ni stockée par Utiluna."
                : "No data is sent to a server or stored by Utiluna."}
            </p>
          ) : (
            <div className="mt-3 grid gap-2 border-t border-[var(--border)] pt-3 sm:grid-cols-2">
              <p>{t.storage}: <strong className="text-[var(--foreground)]">{processing.storage}</strong></p>
              <p>{t.retention}: <strong className="text-[var(--foreground)]">{processing.retention}</strong></p>
              {processing.externalProviders.length > 0 && (
                <p className="sm:col-span-2">
                  {t.externalProviders}: <strong className="text-[var(--foreground)]">{processing.externalProviders.join(", ")}</strong>
                </p>
              )}
              {processing.dataCategories.length > 0 && (
                <p className="sm:col-span-2">
                  {t.dataCategories}: <strong className="text-[var(--foreground)]">{processing.dataCategories.join(", ")}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
