import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--surface-soft)]/45">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-6 lg:px-8">
        <div>
          <Link href={"/" + locale} className="text-lg font-black tracking-[-0.03em]">Utiluna</Link>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">{t.footer.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.footer.explore}</p>
          <div className="mt-3 flex flex-col items-start gap-2 text-sm">
            <Link href={"/" + locale + "/outils"} className="hover:text-[var(--accent)]">{t.nav.tools}</Link>
            <Link href={"/" + locale} className="hover:text-[var(--accent)]">{t.nav.home}</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{t.footer.account}</p>
          <div className="mt-3 flex flex-col items-start gap-2 text-sm">
            <Link href={"/" + locale + "/compte"} className="hover:text-[var(--accent)]">{t.nav.account}</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-[var(--border)] px-4 py-4 text-xs text-[var(--muted)] sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Utiluna
      </div>
    </footer>
  );
}
