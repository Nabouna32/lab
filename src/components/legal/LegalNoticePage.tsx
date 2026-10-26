import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageLayout";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getLegalNoticePath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";

export function getLegalNoticeMetadata(locale: Locale): Metadata {
  const content = getMessages(locale).legalNotice;
  return getPublicPageMetadata(
    {
      title: content.metaTitle,
      description: content.metaDescription,
      path: getLegalNoticePath(locale),
    },
    locale,
  );
}

export default function LegalNoticePage({ locale }: { locale: Locale }) {
  const content = getMessages(locale).legalNotice;

  return (
    <main className="min-h-full" aria-labelledby="legal-notice-title">
      <PageContainer width="narrow" spacing="none" className="py-[var(--space-8)] sm:py-[var(--space-10)]">
      <article className="w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-[var(--space-6)] sm:p-[var(--space-8)] lg:p-[var(--space-10)]">
        <h1 id="legal-notice-title" className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {content.title}
        </h1>

        <p className="mt-[var(--space-4)] text-base leading-7 text-[var(--muted)]">{content.intro}</p>

        <section className="mt-8" aria-labelledby="legal-hosting-title">
          <h2 id="legal-hosting-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.hostingTitle}
          </h2>
          <p className="mt-[var(--space-2)] leading-7 text-[var(--muted)]">{content.hostingDescription}</p>
          <p className="mt-[var(--space-3)] font-semibold text-[var(--foreground)]">{content.hostingName}</p>
          <address className="mt-[var(--space-1)] not-italic leading-7 text-[var(--muted)]">{content.hostingAddress}</address>
          <a
            href="https://vercel.com/legal/privacy-notice"
            target="_blank"
            rel="noreferrer"
            className="mt-[var(--space-2)] inline-flex min-h-11 items-center rounded-full text-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {content.hostingLinkLabel}
          </a>
        </section>

        <section className="mt-8" aria-labelledby="legal-storage-title">
          <h2 id="legal-storage-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.storageTitle}
          </h2>
          <p className="mt-[var(--space-2)] leading-7 text-[var(--muted)]">{content.storageDescription}</p>
          <p className="mt-[var(--space-3)] font-semibold text-[var(--foreground)]">{content.storageName}</p>
          <address className="mt-[var(--space-1)] not-italic leading-7 text-[var(--muted)]">{content.storageAddress}</address>
          <a
            href="https://supabase.com/terms"
            target="_blank"
            rel="noreferrer"
            className="mt-[var(--space-2)] inline-flex min-h-11 items-center rounded-full text-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {content.storageLinkLabel}
          </a>
        </section>

        <section className="mt-8" aria-labelledby="legal-reply-title">
          <h2 id="legal-reply-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.responseTitle}
          </h2>
          <p className="mt-[var(--space-2)] leading-7 text-[var(--muted)]">{content.responseDescription}</p>
        </section>

        <p className="mt-[var(--space-8)] border-t border-[var(--border)] pt-[var(--space-5)] text-sm leading-6 text-[var(--muted)]">
          {content.anonymityNote}
        </p>
      </article>
      </PageContainer>
    </main>
  );
}
