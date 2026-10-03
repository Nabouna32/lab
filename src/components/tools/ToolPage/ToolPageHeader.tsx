import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

type ToolPageHeaderProps = {
  icon: string;
  title: string;
  description: string;
  contentFallback: boolean;
  locale: Locale;
};

export default function ToolPageHeader({
  icon,
  title,
  description,
  contentFallback,
  locale,
}: ToolPageHeaderProps) {
  return (
    <header className="py-1 sm:py-2">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--accent-soft)] text-2xl sm:h-12 sm:w-12 sm:text-3xl"
          aria-hidden="true"
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className="mt-0.5 text-2xl font-black tracking-[-0.035em] sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
            {description}
          </p>
          {contentFallback && (
            <p className="mt-2 text-xs font-medium text-[var(--muted)]" role="status">
              {getMessages(locale).processing.fallbackNotice}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
