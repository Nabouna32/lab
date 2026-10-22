import type { Locale } from "@/lib/i18n/config";
import fr from "./privacy-policy-fr";
import en from "./privacy-policy-en";

export type PolicyLink = { label: string; href: string };
export type PolicySection = { title: string; paragraphs: string[]; bullets?: string[]; links?: PolicyLink[] };
export type PrivacyPolicyContent = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updatedLabel: string;
  updatedAt: string;
  temporaryNoticeTitle: string;
  temporaryNotice: string;
  intro: string;
  sections: PolicySection[];
  contactTitle: string;
  contactIntro: string;
  contactAddress: string;
  contactWarning: string;
};

const content = { fr, en } satisfies Record<Locale, PrivacyPolicyContent>;

export function getPrivacyPolicyContent(locale: Locale): PrivacyPolicyContent {
  return content[locale];
}
