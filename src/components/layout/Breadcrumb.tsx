import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  locale: Locale;
}

const ChevronRight = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default function Breadcrumb({ items, locale }: BreadcrumbProps) {
  return (
    <nav className="mb-6" aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <ChevronRight />}
            {item.current ? (
              <span aria-current="page" className="font-semibold text-[var(--foreground)]">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] rounded"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}