import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getPrivacyPolicyContent } from "@/lib/legal/privacy-policy-content";
import { getPrivacyPolicyPath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { PageContainer } from "@/components/layout/PageLayout";

export function getPrivacyPolicyMetadata(locale: Locale): Metadata {
  const page = getPrivacyPolicyContent(locale);
  return getPublicPageMetadata({ title: page.metaTitle, description: page.metaDescription, path: getPrivacyPolicyPath(locale) }, locale);
}

export default function PrivacyPolicyPage({ locale }: { locale: Locale }) {
  const page = getPrivacyPolicyContent(locale);
  return <main className="min-h-full" aria-labelledby="privacy-title">
    <PageContainer width="narrow" spacing="none" className="py-[var(--space-8)]">
    <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-[var(--space-6)] sm:p-[var(--space-8)]">
      <h1 id="privacy-title" className="text-3xl font-bold text-[var(--foreground)]">{page.title}</h1>
      <p className="mt-[var(--space-3)] text-sm text-[var(--muted)]">{page.updatedLabel}: {page.updatedAt}</p>
      <aside className="mt-[var(--space-6)] rounded-2xl border border-[var(--border)] p-4" aria-label={page.temporaryNoticeTitle}>
        <h2 className="font-semibold">{page.temporaryNoticeTitle}</h2>
        <p className="mt-[var(--space-2)] text-sm leading-6">{page.temporaryNotice}</p>
      </aside>
      <p className="mt-[var(--space-6)] leading-7">{page.intro}</p>
      {page.sections.map((section, index) => <section key={section.title} className="mt-8" aria-labelledby={"policy-section-" + index}>
        <h2 id={"policy-section-" + index} className="text-xl font-semibold">{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-[var(--space-3)] leading-7">{paragraph}</p>)}
        {section.bullets && <ul className="mt-[var(--space-3)] list-disc space-y-[var(--space-2)] pl-6">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
        {section.links && <ul className="mt-[var(--space-3)] list-disc pl-6">{section.links.map((link) => <li key={link.href}><a className="underline" href={link.href}>{link.label}</a></li>)}</ul>}
      </section>)}
      <section className="mt-8" aria-labelledby="policy-contact">
        <h2 id="policy-contact" className="text-xl font-semibold">{page.contactTitle}</h2>
        <p className="mt-[var(--space-3)] leading-7">{page.contactIntro}</p>
        <p className="mt-[var(--space-3)] font-semibold"><a className="underline" href={"mailto:" + page.contactAddress}><code>{page.contactAddress}</code></a></p>
        <p className="mt-[var(--space-3)] leading-7">{page.contactWarning}</p>
      </section>
    </article>
    </PageContainer>
  </main>;
}
