"use client";

import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { isToolProcessingDescriptionFallback, type ToolProcessingMetadata } from "@/lib/tools/types";
import { getToolProcessingPresentation } from "@/lib/tools/processing";
import { IconButton } from "@/components/ui/IconButton";
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
      <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-[var(--shape-corner-large)] bg-[var(--surface-container)] px-3 py-1.5 text-[var(--on-surface-variant)]">
        <MaterialIcon name={presentation.icon} size={18} />
        <span className="m3-type-label-medium">{presentation.label}</span>
      </span>
      <Tooltip content={details} title={t.more} variant="rich" placement="bottom" openOnClick>
        <IconButton label={t.more} title={t.more}>
          <MaterialIcon name="info" size={20} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
