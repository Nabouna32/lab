import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getPrivacyPolicyContent } from "@/lib/legal/privacy-policy-content";
import { getPrivacyPolicyPath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";

export function getPrivacyPolicyMetadata(locale: Locale): Metadata {
  const page = getPrivacyPolicyContent(locale);
  return getPublicPageMetadata({ title: page.metaTitle, description: page.metaDescription, path: getPrivacyPolicyPath(locale) }, locale);
}

export default function PrivacyPolicyPage({ locale }: { locale: Locale }) {
  const page = getPrivacyPolicyContent(locale);
  return <main className="min-h-full px-4 py-8 sm:px-6 lg:px-10" aria-labelledby="privacy-title">
    <article className="mx-auto max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <h1 id="privacy-title" className="m3-type-headline-large text-[var(--foreground)]">{page.title}</h1>
      <p className="m3-type-body-medium mt-3 text-[var(--muted)]">{page.updatedLabel}: {page.updatedAt}</p>
      <aside className="mt-6 rounded-2xl border border-[var(--border)] p-4" aria-label={page.temporaryNoticeTitle}>
        <h2 className="m3-type-label-large">{page.temporaryNoticeTitle}</h2>
        <p className="m3-type-body-medium mt-2">{page.temporaryNotice}</p>
      </aside>
      <p className="m3-type-body-large mt-6">{page.intro}</p>
      {page.sections.map((section, index) => <section key={section.title} className="mt-8" aria-labelledby={"policy-section-" + index}>
        <h2 id={"policy-section-" + index} className="m3-type-headline-small">{section.title}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph} className="m3-type-body-large mt-3">{paragraph}</p>)}
        {section.bullets && <ul className="m3-type-body-large mt-3 list-disc space-y-2 pl-6">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
        {section.links && <ul className="m3-type-body-large mt-3 list-disc pl-6">{section.links.map((link) => <li key={link.href}><a className="underline" href={link.href}>{link.label}</a></li>)}</ul>}
      </section>)}
      <section className="mt-8" aria-labelledby="policy-contact">
        <h2 id="policy-contact" className="m3-type-headline-small">{page.contactTitle}</h2>
        <p className="mt-3 leading-7">{page.contactIntro}</p>
        <p className="m3-type-title-medium mt-3"><a className="underline" href={"mailto:" + page.contactAddress}><code>{page.contactAddress}</code></a></p>
        <p className="mt-3 leading-7">{page.contactWarning}</p>
      </section>
    </article>
  </main>;
}
