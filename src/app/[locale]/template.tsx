"use client";

/**
 * Keep route content in a stable surface. Page-level ViewTransition snapshots
 * can capture theme-dependent pixels while the root theme class is changing;
 * shared app chrome remains outside this route surface.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div data-page-transition-surface>{children}</div>;
}
