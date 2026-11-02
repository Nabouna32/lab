"use client";

import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { isToolProcessingDescriptionFallback, type ToolProcessingMetadata } from "@/lib/tools/types";
import { getToolProcessingPresentation } from "@/lib/tools/processing";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Tooltip } from "@/components/ui/Tooltip";

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

  const details = (
    <div className="grid gap-2">
      <p>{processing.description[locale] ?? processing.description.en}</p>
      {isDescriptionFallback && (
        <p className="text-xs font-medium" role="status">{t.fallbackNotice}</p>
      )}
      {processing.mode === "local" ? (
        <p className="border-t border-[var(--outline-variant)] pt-2">{t.localDetail}</p>
      ) : (
        <div className="grid gap-2 border-t border-[var(--outline-variant)] pt-2">
          <p>{t.storage}: <strong>{processing.storage}</strong></p>
          <p>{t.retention}: <strong>{processing.retention}</strong></p>
          {processing.externalProviders.length > 0 && <p>{t.externalProviders}: <strong>{processing.externalProviders.join(", ")}</strong></p>}
          {processing.dataCategories.length > 0 && <p>{t.dataCategories}: <strong>{processing.dataCategories.join(", ")}</strong></p>}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span className="inline-flex min-h-9 min-w-0 max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] sm:text-sm">
        <MaterialIcon name={presentation.icon} size={18} className="shrink-0 text-[var(--success)] drop-shadow-[0_0_3px_var(--success)]" />
        <span>{presentation.label}</span>
        <Tooltip content={details} title={t.more} variant="rich" placement="bottom" openOnClick>
          <button
            type="button"
            aria-label={t.more}
            className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[var(--muted)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            <MaterialIcon name="info" size={16} />
          </button>
        </Tooltip>
      </span>
    </div>
  );
}
