import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getGuidedWorkflowsPath } from "@/lib/tools/routes";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function HomeGuidedWorkflows({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <section
      aria-label={t.guidedWorkflows.homeTitle}
      className="mx-auto max-w-[var(--content-wide)] px-4 pb-8 pt-2 sm:px-6 sm:pb-10 lg:px-10"
    >
      <Link
        href={getGuidedWorkflowsPath(locale)}
        className="group flex min-h-20 items-center gap-3 rounded-2xl border border-[var(--outline-variant)]/70 bg-[var(--surface-container-low)] p-4 outline-none transition-[border-color,background-color] duration-[var(--motion-standard)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-container)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:gap-4 sm:px-5"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"
          aria-hidden="true"
        >
          <MaterialIcon name="swap_horiz" size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-[var(--foreground)]">
            {t.guidedWorkflows.homeTitle}
          </span>
          <span className="mt-1 block text-sm leading-5 text-[var(--muted)]">
            {t.guidedWorkflows.homeDescription}
          </span>
        </span>
        <span className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 rounded-full px-3 text-sm font-semibold text-[var(--accent)] transition-colors group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--on-primary-container)] sm:px-4">
          <span className="hidden sm:inline">{t.guidedWorkflows.homeAction}</span>
          <MaterialIcon name="arrow_forward" size={18} />
        </span>
      </Link>
    </section>
  );
}
