import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const globalStyles = readSource("../../app/globals.css");
const layoutSources = [
  readSource("../../app/[locale]/page.tsx"),
  readSource("../../app/[locale]/admin/page.tsx"),
  readSource("../../app/[locale]/admin/audit/page.tsx"),
  readSource("../../app/[locale]/admin/utilisateurs/page.tsx"),
  readSource("../../app/[locale]/compte/page.tsx"),
  readSource("../../app/[locale]/compte/connexion/page.tsx"),
  readSource("../../app/[locale]/compte/inscription/page.tsx"),
  readSource("../../app/[locale]/compte/email/page.tsx"),
  readSource("../../app/[locale]/compte/mot-de-passe/page.tsx"),
  readSource("../../app/[locale]/compte/mot-de-passe-oublie/page.tsx"),
  readSource("../../app/[locale]/compte/mot-de-passe/reinitialiser/page.tsx"),
  readSource("../../app/[locale]/compte/suppression/page.tsx"),
  readSource("../../app/[locale]/compte/informations-personnelles/page.tsx"),
  readSource("../../app/[locale]/[section]/page.tsx"),
  readSource("../../app/[locale]/[section]/[slug]/page.tsx"),
  readSource("../../components/layout/Header.tsx"),
  readSource("../../components/layout/Footer.tsx"),
  readSource("../../components/home/RecentTools.tsx"),
  readSource("../../components/home/HomeGuidedWorkflows.tsx"),
  readSource("../../components/information/InformationPage.tsx"),
  readSource("../../components/legal/LegalNoticePage.tsx"),
  readSource("../../components/legal/PrivacyPolicyPage.tsx"),
  readSource("../../components/favorites/FavoritesView.tsx"),
  readSource("../../components/collections/CollectionsView.tsx"),
  readSource("../../components/collections/SharedCollectionView.tsx"),
  readSource("../../components/discovery/GuidedWorkflowsPage.tsx"),
  readSource("../../components/tools/SearchResultsClient.tsx"),
  readSource("../../components/tools/ToolPage/ToolPage.tsx"),
];

test("les compositions de conteneur propres à Loculary ont été remplacées par la mise en page Web native", () => {
  for (const source of layoutSources) {
    assert.doesNotMatch(source, /PageContainer|components\/layout\/PageLayout/, "aucun wrapper PageContainer ne doit subsister");
  }

  for (const token of [
    "--layout-page-gutter:",
    "--layout-content-form:",
    "--layout-content-form-wide:",
    "--layout-content-account:",
    "--layout-content-narrow:",
    "--layout-content-medium:",
    "--layout-content-default:",
    "--layout-content-wide:",
  ]) {
    assert.ok(globalStyles.includes(token), `le token responsive partagé doit rester disponible : ${token}`);
  }
});

test("les rôles typographiques Material 3 restent définis dans le thème partagé", () => {
  for (const role of [
    "display-large",
    "headline-large",
    "title-medium",
    "body-medium",
    "label-large",
  ]) {
    assert.ok(globalStyles.includes(`.m3-type-${role}`), `rôle typographique absent : ${role}`);
  }
});

test("les tokens d'espacement sémantiques restent disponibles pour les adaptations Web", () => {
  for (const token of [
    "--space-0: 0",
    "--space-1:",
    "--space-2:",
    "--space-3:",
    "--space-4:",
    "--space-5:",
    "--space-6:",
    "--space-8:",
    "--space-10:",
    "--space-12:",
    "--space-16:",
    "--layout-page-section-gap:",
    "--layout-content-gap:",
    "--layout-item-gap:",
  ]) {
    assert.ok(globalStyles.includes(token), `token d'espacement absent : ${token}`);
  }
});

const layoutWidthExpectations = [
  ["../../app/[locale]/page.tsx", { wide: 1 }],
  ["../../app/[locale]/admin/page.tsx", { default: 1 }],
  ["../../app/[locale]/admin/audit/page.tsx", { default: 1 }],
  ["../../app/[locale]/admin/utilisateurs/page.tsx", { default: 1 }],
  ["../../app/[locale]/compte/page.tsx", { account: 1, narrow: 1 }],
  ["../../app/[locale]/compte/connexion/page.tsx", { account: 1, form: 1 }],
  ["../../app/[locale]/compte/inscription/page.tsx", { account: 1, form: 1 }],
  ["../../app/[locale]/compte/email/page.tsx", { form: 1 }],
  ["../../app/[locale]/compte/mot-de-passe/page.tsx", { form: 1 }],
  ["../../app/[locale]/compte/mot-de-passe-oublie/page.tsx", { form: 1 }],
  ["../../app/[locale]/compte/mot-de-passe/reinitialiser/page.tsx", { form: 2 }],
  ["../../app/[locale]/compte/suppression/page.tsx", { "form-wide": 1 }],
  ["../../app/[locale]/compte/informations-personnelles/page.tsx", { narrow: 1 }],
  ["../../app/[locale]/[section]/page.tsx", { wide: 1 }],
  ["../../app/[locale]/[section]/[slug]/page.tsx", { wide: 1 }],
  ["../../components/layout/Header.tsx", { wide: 1 }],
  ["../../components/layout/Footer.tsx", { wide: 1 }],
  ["../../components/home/RecentTools.tsx", { wide: 1 }],
  ["../../components/home/HomeGuidedWorkflows.tsx", { wide: 1 }],
  ["../../components/information/InformationPage.tsx", { narrow: 3 }],
  ["../../components/legal/LegalNoticePage.tsx", { narrow: 1 }],
  ["../../components/legal/PrivacyPolicyPage.tsx", { narrow: 1 }],
  ["../../components/favorites/FavoritesView.tsx", { medium: 1 }],
  ["../../components/collections/CollectionsView.tsx", { medium: 1 }],
  ["../../components/collections/SharedCollectionView.tsx", { medium: 1 }],
  ["../../components/discovery/GuidedWorkflowsPage.tsx", { wide: 1 }],
  ["../../components/tools/SearchResultsClient.tsx", { wide: 1 }],
  ["../../components/tools/ToolPage/ToolPage.tsx", { default: 1 }],
] as const;

test("les adaptations Web préservent exactement les largeurs et gouttières de chaque composition migrée", () => {
  for (const [path, widths] of layoutWidthExpectations) {
    const source = readSource(path);
    const expectedCount = Object.values(widths).reduce((total, count) => total + count, 0);
    const gutterCount = source.match(/px-\[var\(--layout-page-gutter\)\]/g)?.length ?? 0;
    assert.equal(gutterCount, expectedCount, `${path} doit conserver une gouttière par conteneur`);

    for (const [width, count] of Object.entries(widths)) {
      const pattern = new RegExp(`max-w-\\[var\\(--layout-content-${width}\\)\\]`, "g");
      assert.equal(source.match(pattern)?.length ?? 0, count, `${path} doit conserver ${count} conteneur(s) de largeur ${width}`);
    }
  }
});

test("les surfaces de production conservent leurs rôles typographiques Material 3", () => {
  const paths = [
    "../../app/[locale]/page.tsx",
    "../../app/[locale]/[section]/page.tsx",
    "../../components/tools/SearchResultsClient.tsx",
    "../../app/[locale]/admin/page.tsx",
    "../../app/[locale]/admin/utilisateurs/page.tsx",
    "../../components/legal/LegalNoticePage.tsx",
    "../../components/legal/PrivacyPolicyPage.tsx",
    "../../app/[locale]/compte/page.tsx",
    "../../app/[locale]/compte/connexion/page.tsx",
    "../../app/[locale]/compte/inscription/page.tsx",
    "../../app/[locale]/compte/mot-de-passe-oublie/page.tsx",
    "../../app/[locale]/compte/mot-de-passe/reinitialiser/page.tsx",
  ];

  for (const path of paths) {
    assert.match(readSource(path), /m3-type-(?:display|headline|title|body|label)-/, `${path} doit conserver la typographie Material 3`);
  }
});
