import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getToolById } from "@/lib/tools/catalog";
import { getPrimaryToolCategory } from "@/lib/tools/types";
import ToolSearch from "@/components/tools/ToolSearch";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getMessages(locale);

  return (
    <section className="relative z-10 isolate overflow-hidden">
      <div className="decorative-glow pointer-events-none absolute -left-32 -top-24 -z-10 h-72 w-72 rounded-full" />
      <div className="decorative-glow-fuchsia pointer-events-none absolute -right-24 top-4 -z-10 h-80 w-80 rounded-full" />
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--muted)] shadow-[var(--shadow-sm)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            {t.home.badge}
          </div>
          <h1 className="text-balance text-3xl font-black tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            {t.home.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
            {t.home.description}
          </p>
          <div className="mx-auto mt-7 max-w-2xl text-left sm:mt-8">
            <ToolSearch locale={locale} instanceId="home-tool-search" />
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {t.home.quickLinks.map((link) => {
                const tool = getToolById(link.toolId);
                if (!tool) return null;
                return (
                  <a
                    key={link.toolId}
                    href={"/" + locale + "/outils/" + getPrimaryToolCategory(tool) + "/" + tool.slug}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:text-sm"
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
