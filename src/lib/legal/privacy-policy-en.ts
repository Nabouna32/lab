import type { PrivacyPolicyContent } from "./privacy-policy-content";

const en: PrivacyPolicyContent = {
  metaTitle: "Privacy Policy | Loculary",
  metaDescription: "Personal data, accounts, local storage, providers and user rights on Loculary.",
  title: "Privacy policy",
  updatedLabel: "Last updated",
  updatedAt: "22 October 2026",
  temporaryNoticeTitle: "Provisional version — contact details to be finalised",
  temporaryNotice: "This first version is published before the permanent contact address has been created. The address below is a non-operational placeholder. Retention periods for some logs and contractual details about providers still need confirmation. This policy will be reviewed after the domain and contact address are set up.",
  intro: "Loculary aims to minimise data collection and favour processing in your browser. This policy describes processing identified in the code and configuration reviewed. Practices may change; check each tool’s processing information before submitting data to it.",
  sections: [
    { title: "1. Data controller", paragraphs: [
      "The data controller is the publisher of Loculary, which operates the service on a non-professional basis. To preserve public anonymity, the publisher’s civil identity is not displayed here, subject to the conditions of the anonymity regime available to non-professional publishers.",
      "This presentation does not remove obligations under the GDPR. How required identification information must be provided still needs to be confirmed in a legal review."
    ]},
    { title: "2. Data and purposes", paragraphs: ["The data depends on the features you use."], bullets: [
      "Account and authentication: email address, technical identifiers and authentication data managed through Supabase Auth to create, secure and administer your account.",
      "Profile: display name and preferred language, if provided, to personalise the interface.",
      "Synced favourites and collections: saved tool identifiers, collection names and the tools they contain.",
      "Shared collections: if an owner deliberately enables sharing, the link exposes the collection name and tool list. Collections are private by default and the link can be disabled.",
      "Technical and security data: request information, technical logs and administrative events for troubleshooting, availability and security.",
      "Browser storage: some preferences, recently used tools, anonymous favourites or collections may remain saved on your device."
    ]},
    { title: "3. Tool inputs and files", paragraphs: [
      "The current published catalogue classifies its tools as processing data locally in your browser. Tool inputs, files and results are not sent to Loculary or saved to your account by default. Content you later copy, download or share is subject to the action you choose.",
      "This does not mean the site processes no other data: account sessions, favourites and technical data are separate from tool inputs. If a tool or feature changes to use an external service or server processing, its information and this policy must be updated."
    ]},
    { title: "4. Legal bases", paragraphs: ["Depending on the feature, the identified legal bases are:"], bullets: [
      "Performance of the requested service: account creation and management, authentication, and syncing favourites and collections.",
      "Legitimate interests: security, abuse prevention, incident diagnosis and retaining administrative records needed for security.",
      "Legal obligation: retention or disclosure where applicable law requires it.",
      "Local storage: remembering preferences and selections needed for the requested feature. Any future tracker subject to consent must follow applicable rules."
    ]},
    { title: "5. Providers and transfers", paragraphs: [
      "Vercel provides hosting and deployment; Supabase provides authentication and the database. These providers and their subprocessors may process data needed for their services. Disclosure may also occur when required by law.",
      "The Supabase project is configured in London, United Kingdom, for its primary database and authentication. This region does not guarantee that all provider processing remains there. Vercel may process data in the United States and elsewhere depending on its operations."
    ], links: [
      { label: "Vercel Privacy Notice", href: "https://vercel.com/legal/privacy-notice" },
      { label: "Supabase data residency and transfers documentation", href: "https://supabase.com/legal/privacy-resources/data-residency-and-transfers-faq" },
      { label: "Supabase Privacy Policy", href: "https://supabase.com/privacy" }
    ]},
    { title: "6. International transfer safeguards", paragraphs: [
      "Some processing may take place outside the European Economic Area, including in the United States or United Kingdom. Applicable mechanisms and safeguards depend on the service, configuration and agreements in force with each provider.",
      "The exact contractual arrangements and safeguards applicable to the Loculary account still need to be checked. The database location alone is not enough to conclude that every data flow is covered."
    ]},
    { title: "7. Retention and deletion", paragraphs: [
      "Data is retained only as long as needed for the relevant feature, subject to legal obligations and security needs. Exact periods for some logs are not yet documented; no unsupported numerical period is stated here."
    ], bullets: [
      "Account and profile: until account deletion, subject to data that must be retained or neutralised for legal or security reasons.",
      "Account-linked favourites and collections: until you delete them or delete the account. Sharing ends when the link is disabled or the collection is deleted.",
      "Browser data: until you delete it or clear browser storage.",
      "Administrative audit log: some events may remain after account deletion; direct account references are neutralised. The maximum retention period still needs to be formalised.",
      "Infrastructure logs: retention depends on provider settings and policies, which need confirmation for the deployed configuration."
    ]},
    { title: "8. Cookies and browser storage", paragraphs: [
      "Authentication may use cookies or session mechanisms needed for account functionality. The browser may also retain preferences, favourites, anonymous collections or recently used tools.",
      "The source-code review for this version did not identify an advertising integration or audience analytics tool. A separate production check is still needed to establish the full inventory of cookies, trackers and third-party scripts, their durations and triggers."
    ]},
    { title: "9. Your rights", paragraphs: [
      "Subject to the GDPR’s conditions, you may request access to your data, rectification or erasure, restriction of certain processing, object to processing based on legitimate interests, and request portability of eligible data. You may withdraw consent where it is the legal basis; this does not affect prior processing.",
      "Reasonable information may be requested to verify your identity. You may also lodge a complaint with the French data protection authority (CNIL)."
    ], links: [
      { label: "CNIL — individual rights", href: "https://www.cnil.fr/fr/les-droits-pour-maitriser-vos-donnees-personnelles" },
      { label: "CNIL — lodge a complaint", href: "https://www.cnil.fr/fr/plaintes" }
    ]},
    { title: "10. Security and updates", paragraphs: [
      "Loculary applies technical and organisational measures appropriate to the service, including access controls for account data and database security policies. No connected system can guarantee absolute security.",
      "This policy will be updated if features, providers, configurations, retention periods or contact details change."
    ]}
  ],
  contactTitle: "Contact about personal data",
  contactIntro: "The intended channel for questions and requests about personal data is:",
  contactAddress: "privacy@tondomaine",
  contactWarning: "This address is provisional and is not operational. Do not send a request before the domain is purchased and the address created. This limitation should be resolved as soon as possible."
};

export default en;
