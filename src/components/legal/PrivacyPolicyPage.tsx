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
      <h1 id="privacy-title" className="m3-type-headline-large text-[var(--foreground)]">{page.title}</h1>
      <p className="m3-type-body-small mt-[var(--space-3)] text-[var(--muted)]">{page.updatedLabel}: {page.updatedAt}</p>
      <aside className="mt-[var(--space-6)] rounded-2xl border border-[var(--border)] p-[var(--space-4)]" aria-label={page.temporaryNoticeTitle}>
        <h2 className="m3-type-title-medium">{page.temporaryNoticeTitle}</h2>
        <p className="m3-type-body-medium mt-[var(--space-2)]">{page.temporaryNotice}</p>
      </aside>
      <p className="m3-type-body-large mt-[var(--space-6)]">{page.intro}</p>
      {page.sections.map((section, index) => <section key={section.title} className="mt-[var(--space-8)]" aria-labelledby={"policy-section-" + index}>
        <h2 id={"policy-section-" + index} className="m3-type-title-large">{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph} className="m3-type-body-large mt-[var(--space-3)]">{paragraph}</p>)}
        {section.bullets && <ul className="m3-type-body-large mt-[var(--space-3)] list-disc space-y-[var(--space-2)] pl-[var(--space-6)]">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
        {section.links && <ul className="m3-type-body-large mt-[var(--space-3)] list-disc pl-[var(--space-6)]">{section.links.map((link) => <li key={link.href}><a className="underline" href={link.href}>{link.label}</a></li>)}</ul>}
      </section>)}
      <section className="mt-[var(--space-8)]" aria-labelledby="policy-contact">
        <h2 id="policy-contact" className="m3-type-title-large">{page.contactTitle}</h2>
        <p className="m3-type-body-large mt-[var(--space-3)]">{page.contactIntro}</p>
        <p className="m3-type-body-large mt-[var(--space-3)]"><a className="underline" href={"mailto:" + page.contactAddress}><code>{page.contactAddress}</code></a></p>
        <p className="m3-type-body-large mt-[var(--space-3)]">{page.contactWarning}</p>
      </section>
    </article>
    </PageContainer>
  </main>;
}
