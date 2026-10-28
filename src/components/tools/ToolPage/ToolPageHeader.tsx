import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ShareToolButton from "./ShareToolButton";

type ToolPageHeaderProps = {
  icon: string;
  title: string;
  description: string;
  contentFallback: boolean;
  locale: Locale;
  toolId: string;
};

export default function ToolPageHeader({
  icon,
  title,
  description,
  contentFallback,
  locale,
  toolId,
}: ToolPageHeaderProps) {
  return (
    <header className="py-1 sm:py-2">
      <div className="flex flex-wrap items-start gap-3 sm:gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--shape-corner-large)] bg-[var(--accent-soft)] text-2xl sm:h-12 sm:w-12 sm:text-3xl"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="m3-type-headline-medium mt-0.5">
            {title}
          </h1>
          <p className="m3-type-body-medium mt-1.5 max-w-3xl text-[var(--muted)]">
            {description}
          </p>
          {contentFallback && (
            <p className="m3-type-body-small mt-2 text-[var(--muted)]" role="status">
              {getMessages(locale).processing.fallbackNotice}
            </p>
          )}
        </div>
        <div className="flex w-full shrink-0 items-center justify-end gap-2 pt-0.5 sm:w-auto">
          <ShareToolButton title={title} description={description} locale={locale} />
          <FavoriteButton toolId={toolId} locale={locale} compact />
        </div>
      </div>
    </header>
  );
}
