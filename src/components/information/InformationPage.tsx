import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { getAboutPath, getBugReportPath, getContactPath } from "@/lib/tools/routes";
import { getPublicPageMetadata } from "@/lib/tools/page-metadata";

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
    return <main className="min-h-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10" aria-labelledby="information-title">
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
        <h1 id="information-title" className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">{page.title}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{page.intro}</p>
        <section className="mt-8" aria-labelledby="principles-title">
          <h2 id="principles-title" className="text-xl font-semibold text-[var(--foreground)]">{page.principlesTitle}</h2>
          <ul className="mt-3 list-disc space-y-3 pl-6 leading-7 text-[var(--muted)]">{page.principles.map((principle) => <li key={principle}>{principle}</li>)}</ul>
        </section>
        <section className="mt-8" aria-labelledby="transparency-title">
          <h2 id="transparency-title" className="text-xl font-semibold text-[var(--foreground)]">{page.privacyTitle}</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{page.privacy}</p>
          <a href={messages.nav.home ? (locale === "fr" ? "/fr/politique-de-confidentialite" : "/en/privacy-policy") : "#"} className="mt-3 inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{messages.footer.privacyPolicy}</a>
        </section>
        <section className="mt-8" aria-labelledby="evolving-title">
          <h2 id="evolving-title" className="text-xl font-semibold text-[var(--foreground)]">{page.toolsTitle}</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{page.tools}</p>
        </section>
      </article>
    </main>;
  }

  if (kind === "contact") {
    const page = messages.contactPage;
    return <main className="min-h-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10" aria-labelledby="information-title">
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
        <h1 id="information-title" className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">{page.title}</h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{page.intro}</p>
        <section className="mt-8" aria-labelledby="general-contact-title">
          <h2 id="general-contact-title" className="text-xl font-semibold text-[var(--foreground)]">{page.statusTitle}</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{page.status}</p>
        </section>
        <section className="mt-8" aria-labelledby="privacy-contact-title">
          <h2 id="privacy-contact-title" className="text-xl font-semibold text-[var(--foreground)]">{page.privacyTitle}</h2>
          <p className="mt-2 leading-7 text-[var(--muted)]">{page.privacy}</p>
          <a href={"mailto:" + page.privacyEmail} className="mt-3 inline-flex min-h-11 items-center rounded-sm font-semibold text-[var(--accent)] underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]">{page.privacyEmail}</a>
        </section>
      </article>
    </main>;
  }

  const page = messages.bugReportPage;
  return <main className="min-h-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10" aria-labelledby="information-title">
    <article className="mx-auto w-full max-w-3xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-10">
      <h1 id="information-title" className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">{page.title}</h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">{page.intro}</p>
      <aside className="mt-8 rounded-2xl border border-[var(--border)] p-4" aria-labelledby="status-title">
        <h2 id="status-title" className="font-semibold text-[var(--foreground)]">{page.statusTitle}</h2>
        <p className="mt-2 leading-7 text-[var(--muted)]">{page.status}</p>
      </aside>
      <p className="mt-6 text-sm leading-6 text-[var(--muted)]">{page.nextStep}</p>
    </article>
  </main>;
}
