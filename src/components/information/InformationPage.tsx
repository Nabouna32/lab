import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getAboutPath, getContactPath, getPrivacyPolicyPath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";
import { Arrangement } from "@/components/layout/compose/Arrangement";
import { Column } from "@/components/layout/compose/Column";
import { PageContainer } from "@/components/layout/PageLayout";

export type InformationPageKind = "about" | "contact" | "bugReport";

export function getInformationPageMetadata(locale: Locale, kind: "about" | "contact"): Metadata {
  const page = getMessages(locale)[kind === "about" ? "aboutPage" : "contactPage"];
  return getPublicPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: kind === "about" ? getAboutPath(locale) : getContactPath(locale),
  }, locale);
}

export default function InformationPage({ locale, kind }: { locale: Locale; kind: InformationPageKind }) {
  const messages = getMessages(locale);

  if (kind === "about") {
    const page = messages.aboutPage;
    return (
      <main className="min-h-full" aria-labelledby="information-title">
        <PageContainer width="narrow" spacing="default">
          <article className="w-full rounded-[var(--shape-corner-extra-large)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
            <Column verticalArrangement={Arrangement.spacedBy("var(--layout-content-gap)")}>
              <h1 id="information-title" className="m3-type-headline-large text-[var(--foreground)]">{page.title}</h1>
              <p className="m3-type-body-large text-[var(--muted)]">{page.intro}</p>
              <section aria-labelledby="principles-title">
                <h2 id="principles-title" className="m3-type-title-large text-[var(--foreground)]">{page.principlesTitle}</h2>
                <ul className="mt-3 list-disc space-y-3 pl-6 m3-type-body-large text-[var(--muted)]">{page.principles.map((principle) => <li key={principle}>{principle}</li>)}</ul>
              </section>
              <section aria-labelledby="transparency-title">
                <h2 id="transparency-title" className="m3-type-title-large text-[var(--foreground)]">{page.privacyTitle}</h2>
                <p className="mt-2 m3-type-body-large text-[var(--muted)]">{page.privacy}</p>
                <a href={getPrivacyPolicyPath(locale)} className="mt-3 inline-flex min-h-11 items-center rounded-[var(--shape-corner-extra-small)] m3-type-label-large text-[var(--primary)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{messages.footer.privacyPolicy}</a>
              </section>
              <section aria-labelledby="evolving-title">
                <h2 id="evolving-title" className="m3-type-title-large text-[var(--foreground)]">{page.toolsTitle}</h2>
                <p className="mt-2 m3-type-body-large text-[var(--muted)]">{page.tools}</p>
              </section>
            </Column>
          </article>
        </PageContainer>
      </main>
    );
  }

  if (kind === "contact") {
    const page = messages.contactPage;
    return (
      <main className="min-h-full" aria-labelledby="information-title">
        <PageContainer width="narrow" spacing="default">
          <article className="w-full rounded-[var(--shape-corner-extra-large)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
            <Column verticalArrangement={Arrangement.spacedBy("var(--layout-content-gap)")}>
              <h1 id="information-title" className="m3-type-headline-large text-[var(--foreground)]">{page.title}</h1>
              <p className="m3-type-body-large text-[var(--muted)]">{page.intro}</p>
              <section aria-labelledby="general-contact-title">
                <h2 id="general-contact-title" className="m3-type-title-large text-[var(--foreground)]">{page.statusTitle}</h2>
                <p className="mt-2 m3-type-body-large text-[var(--muted)]">{page.status}</p>
              </section>
              <section aria-labelledby="privacy-contact-title">
                <h2 id="privacy-contact-title" className="m3-type-title-large text-[var(--foreground)]">{page.privacyTitle}</h2>
                <p className="mt-2 m3-type-body-large text-[var(--muted)]">{page.privacy}</p>
                <a href={"mailto:" + page.privacyEmail} className="mt-3 inline-flex min-h-11 items-center rounded-[var(--shape-corner-extra-small)] m3-type-label-large text-[var(--primary)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{page.privacyEmail}</a>
              </section>
            </Column>
          </article>
        </PageContainer>
      </main>
    );
  }

  const page = messages.bugReportPage;
  return (
    <main className="min-h-full" aria-labelledby="information-title">
      <PageContainer width="narrow" spacing="default">
        <article className="w-full rounded-[var(--shape-corner-extra-large)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
          <Column verticalArrangement={Arrangement.spacedBy("var(--layout-content-gap)")}>
            <h1 id="information-title" className="m3-type-headline-large text-[var(--foreground)]">{page.title}</h1>
            <p className="m3-type-body-large text-[var(--muted)]">{page.intro}</p>
            <aside className="rounded-[var(--shape-corner-large)] border border-[var(--border)] p-4" aria-labelledby="status-title">
              <h2 id="status-title" className="m3-type-title-medium text-[var(--foreground)]">{page.statusTitle}</h2>
              <p className="mt-2 m3-type-body-large text-[var(--muted)]">{page.status}</p>
            </aside>
            <p className="m3-type-body-medium text-[var(--muted)]">{page.nextStep}</p>
          </Column>
        </article>
      </PageContainer>
    </main>
  );
}
