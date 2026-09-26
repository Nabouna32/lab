import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  const t = getMessages(locale);

  return (
    <nav aria-label={t.breadcrumbs.label} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
        <li>
          <Link href={"/" + locale} className="rounded-md hover:text-[var(--foreground)]">{t.nav.home}</Link>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href} className="rounded-md hover:text-[var(--foreground)]">{item.label}</Link>
            ) : (
              <span aria-current={index === items.length - 1 ? "page" : undefined} className="font-medium text-[var(--foreground)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
