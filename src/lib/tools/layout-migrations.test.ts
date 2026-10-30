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
