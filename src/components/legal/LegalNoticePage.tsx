import type { Metadata } from "next";
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
    <main className="min-h-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10" aria-labelledby="legal-notice-title">
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
        <h1 id="legal-notice-title" className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {content.title}
        </h1>

        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{content.intro}</p>

        <section className="mt-8" aria-labelledby="legal-hosting-title">
          <h2 id="legal-hosting-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.hostingTitle}
          </h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{content.hostingDescription}</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">{content.hostingName}</p>
          <address className="mt-1 not-italic leading-7 text-[var(--muted)]">{content.hostingAddress}</address>
          <a
            href="https://vercel.com/legal/privacy-notice"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center rounded-full text-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {content.hostingLinkLabel}
          </a>
        </section>

        <section className="mt-8" aria-labelledby="legal-storage-title">
          <h2 id="legal-storage-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.storageTitle}
          </h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{content.storageDescription}</p>
          <p className="mt-3 font-semibold text-[var(--foreground)]">{content.storageName}</p>
          <address className="mt-1 not-italic leading-7 text-[var(--muted)]">{content.storageAddress}</address>
          <a
            href="https://supabase.com/terms"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center rounded-full text-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {content.storageLinkLabel}
          </a>
        </section>

        <section className="mt-8" aria-labelledby="legal-reply-title">
          <h2 id="legal-reply-title" className="text-xl font-semibold text-[var(--foreground)]">
            {content.responseTitle}
          </h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{content.responseDescription}</p>
        </section>

        <p className="mt-8 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--muted)]">
          {content.anonymityNote}
        </p>
      </article>
    </main>
  );
}
