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
  const t = getMessages(locale);

  return (
    <header className="relative overflow-hidden border-y border-[var(--border)] py-5 sm:py-7">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[var(--accent-soft)] blur-3xl" aria-hidden="true" />
      <div className="relative grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-7 motion-reveal">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-xl)] border border-[var(--accent)]/25 bg-[var(--accent-soft)] text-3xl shadow-[var(--shadow-sm)] sm:h-20 sm:w-20 sm:text-4xl" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 h-0.5 rounded-full bg-[var(--accent)]" />
          {icon}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{t.nav.tools}</span>
            {contentFallback && (
              <span className="text-xs font-medium text-[var(--muted)]" role="status">
                {t.processing.fallbackNotice}
              </span>
            )}
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-[-0.05em] sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p>
        </div>
      </div>
    </header>
  );
}
