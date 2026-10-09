import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  const t = getMessages(locale);

  return (
    <nav aria-label={t.breadcrumbs.label} className="mb-4 sm:mb-5">
      <ol className="flex min-w-0 items-center gap-1 text-xs text-[var(--muted)] sm:gap-1.5 sm:text-sm">
        <li className="hidden shrink-0 items-center sm:flex">
          <Link
            href={"/" + locale}
            className="rounded-md px-1 py-0.5 outline-none transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {t.nav.home}
          </Link>
        </li>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li
              key={item.label}
              className="flex min-w-0 items-center gap-1 sm:gap-1.5"
            >
              <span aria-hidden="true" className="shrink-0 text-[var(--muted)]/50">
                ›
              </span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="min-w-0 max-w-[42vw] truncate rounded-md px-1 py-0.5 outline-none transition-colors hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] sm:max-w-none"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className="min-w-0 max-w-[52vw] truncate rounded-md px-1 py-0.5 font-medium text-[var(--foreground)] sm:max-w-none"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
