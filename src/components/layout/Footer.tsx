import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolsPath } from "@/lib/tools/routes";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]/70">
      <div className="flex flex-col gap-3 px-4 py-3.5 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-black tracking-[-0.03em] text-[var(--foreground)]">Loculary</span>
          <span className="hidden h-1 w-1 rounded-full bg-[var(--border-strong)] sm:block" aria-hidden="true" />
          <span className="truncate">{t.footer.tagline}</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href={getToolsPath(locale)} className="rounded-lg px-2.5 py-1.5 font-semibold transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            {t.nav.tools}
          </Link>
          <Link href={"/" + locale + "/compte"} className="rounded-lg px-2.5 py-1.5 font-semibold transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">
            {t.nav.account}
          </Link>
          <span className="ml-1 hidden border-l border-[var(--border)] pl-3 sm:inline">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
