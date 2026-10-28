import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const homePageSource = readSource("../../app/[locale]/page.tsx");
const homeWorkflowsSource = readSource("../../components/home/HomeGuidedWorkflows.tsx");
const signInPageSource = readSource("../../app/[locale]/compte/connexion/page.tsx");
const signUpPageSource = readSource("../../app/[locale]/compte/inscription/page.tsx");
const pageLayoutSource = readSource("../../components/layout/PageLayout.tsx");
const headerSource = readSource("../../components/layout/Header.tsx");
const headerSearchSource = readSource("../../components/layout/HeaderSearch.tsx");
const logoSource = readSource("../../components/brand/LocularyLogo.tsx");
const imageMetadataSource = readSource("../../components/tools/image-metadata/ImageMetadataViewer.tsx");
const toolsCatalogueSource = readSource("../../app/[locale]/[section]/page.tsx");
const toolSearchSource = readSource("../../components/tools/ToolSearch.tsx");
const adminDashboardSource = readSource("../../app/[locale]/admin/page.tsx");
const adminUsersSource = readSource("../../app/[locale]/admin/utilisateurs/page.tsx");
const desktopHeaderMenuSource = readSource("../../components/layout/DesktopHeaderMenu.tsx");
const toolCardSource = readSource("../../components/tools/ToolCard.tsx");
const searchResultsSource = readSource("../../components/tools/SearchResultsClient.tsx");

test("homepage compositions reuse the shared width, gutters and spacing tokens", () => {
  assert.ok(homePageSource.includes('<PageContainer'));
  assert.ok(homePageSource.includes('width="wide"'));
  assert.ok(homePageSource.includes("pb-[var(--space-8)] pt-[var(--space-8)]"));
  assert.ok(homePageSource.includes("sm:pb-[var(--space-10)] sm:pt-[var(--space-10)]"));
  assert.ok(!homePageSource.includes("max-w-[var(--content-wide)]"));
  assert.ok(homeWorkflowsSource.includes('<PageContainer'));
  assert.ok(homeWorkflowsSource.includes('width="wide"'));
  assert.ok(homeWorkflowsSource.includes("pb-[var(--space-8)] sm:pb-[var(--space-10)]"));
  assert.ok(!homeWorkflowsSource.includes("pt-[var(--space-2)]"));
  assert.ok(homePageSource.includes('import { Column } from "@/components/layout/compose/Column"'));
  assert.ok(homePageSource.includes('import { Arrangement } from "@/components/layout/compose/Arrangement"'));
  assert.ok(homePageSource.includes('verticalArrangement={Arrangement.spacedBy("var(--layout-page-section-gap)")}'));
  assert.ok(!homePageSource.includes("ElevatedCard"));
  assert.ok(homePageSource.includes('verticalArrangement={Arrangement.spacedBy("var(--space-6)")} className="mx-auto w-full max-w-4xl"'));
  assert.ok(homePageSource.includes('verticalArrangement={Arrangement.spacedBy("var(--space-4)")} className="w-full"'));
  assert.ok(!homePageSource.includes('className="mt-6 max-w-3xl scroll-mt-28"'));
  assert.ok(!homePageSource.includes("t.home.badge"));
  assert.ok(homeWorkflowsSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(homeWorkflowsSource.includes('import { Box } from "@/components/layout/compose/Box"'));
  assert.ok(homeWorkflowsSource.includes("contentAlignment={Alignment.Center}"));
  assert.ok(homeWorkflowsSource.includes('aria-hidden="true"'));
  assert.ok(homeWorkflowsSource.includes('Arrangement.spacedBy("var(--layout-item-gap)")'));
  assert.ok(!homeWorkflowsSource.includes("--home-workflow-card-gap"));
  assert.ok(!homeWorkflowsSource.includes("group flex min-h-20 items-center gap-3"));
  assert.ok(!homeWorkflowsSource.includes("px-4 sm:px-6 lg:px-10"));
});

test("shared Material 3 typography roles are consumed by reusable site components", () => {
  const globalStyles = readSource("../../app/globals.css");
  const buttonSource = readSource("../../components/ui/Button.tsx");
  const toolCardSource = readSource("../../components/tools/ToolCard.tsx");
  const toolHeaderSource = readSource("../../components/tools/ToolPage/ToolPageHeader.tsx");

  for (const role of ["display-large", "headline-large", "title-medium", "body-medium", "label-large"]) {
    assert.ok(globalStyles.includes(`.m3-type-${role}`), `missing shared typography role: ${role}`);
  }
  assert.ok(buttonSource.includes("m3-type-label-large"));
  assert.ok(homeWorkflowsSource.includes("m3-type-title-medium"));
  assert.ok(homeWorkflowsSource.includes("m3-type-body-medium"));
  assert.ok(toolCardSource.includes("m3-type-title-medium"));
  assert.ok(toolHeaderSource.includes("m3-type-headline-medium"));
});

test("signed-in states on sign-in and sign-up pages use the shared account container", () => {
  for (const source of [signInPageSource, signUpPageSource]) {
    assert.ok(source.includes('width="account"'));
    assert.ok(source.includes("min-h-[calc(100vh-4.5rem)]"));
    assert.ok(source.includes("py-[var(--space-12)]"));
    assert.ok(source.includes('width="form"'), "the actual auth form keeps its narrower form width");
    assert.ok(source.includes('import AppLink from "@/components/ui/AppLink"'));
    assert.ok(source.includes('variant="inline"'));
    assert.ok(!source.includes('<Link className="mt-6 inline-flex font-semibold'));
  }
});

test("shared page container owns the canonical responsive gutter and width presets", () => {
  assert.ok(pageLayoutSource.includes("var(--layout-page-gutter)"));
  for (const preset of ["form", "form-wide", "account", "narrow", "medium", "default", "wide"]) {
    assert.ok(pageLayoutSource.includes(`"${preset}"`) || pageLayoutSource.includes(`${preset}:`), `missing width preset: ${preset}`);
  }
});

const legalNoticeSource = readSource("../../components/legal/LegalNoticePage.tsx");
const privacyPolicySource = readSource("../../components/legal/PrivacyPolicyPage.tsx");

test("legal pages use the shared spacing scale instead of duplicating Tailwind spacing values", () => {
  for (const source of [legalNoticeSource, privacyPolicySource]) {
    for (const token of ["--space-2", "--space-3", "--space-6", "--space-8"]) {
      assert.ok(source.includes(`var(${token})`), `missing shared spacing token: ${token}`);
    }
    for (const rawClass of ["mt-2", "mt-3", "mt-4", "mt-6", "mt-8", "p-4", "p-6", "p-8", "p-10", "pt-5", "pl-6", "space-y-2"]) {
      assert.ok(!source.includes(rawClass), `raw spacing class remains: ${rawClass}`);
    }
  }
});

const categoryPageSource = readSource("../../app/[locale]/[section]/[slug]/page.tsx");

test("category page section rhythm uses the shared spacing tokens", () => {
  assert.ok(categoryPageSource.includes("pb-[var(--space-7)] pt-[var(--space-7)] sm:pb-[var(--space-9)]"));
  assert.ok(categoryPageSource.includes('className="py-[var(--space-7)] sm:py-[var(--space-9)]"'));
  assert.ok(categoryPageSource.includes('className="mb-[var(--space-4)]"'));
  assert.ok(!categoryPageSource.includes("pb-7 pt-7 sm:pb-9"));
  assert.ok(!categoryPageSource.includes('className="py-7 sm:py-9"'));
});


test("header layout reuses Row and a weighted Spacer instead of a product-specific grid", () => {
  assert.ok(headerSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(headerSource.includes('import { Spacer } from "@/components/layout/compose/Spacer"'));
  assert.ok(headerSource.includes("Modifier.then(RowScope.weight(1))"));
  assert.ok(headerSource.includes('import { Modifier, RowScope } from "@/components/layout/compose/Modifier"'));
  assert.ok(headerSource.includes('Arrangement.spacedBy("var(--header-layout-gap)")'));
  assert.ok(headerSource.includes('Arrangement.spacedBy("var(--header-control-gap)")'));
  assert.ok(!headerSource.includes("flex shrink-0 items-center gap-0.5"));
  assert.ok(!headerSource.includes("grid-cols-[1fr_auto]"));
});


test("brand wordmark uses the shared Row primitive", () => {
  assert.ok(logoSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(!logoSource.includes("inline-flex items-center"));
});


test("header search panel uses Row while retaining its stable panel ID", () => {
  assert.ok(headerSearchSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(headerSearchSource.includes('id="header-tool-search-panel"'));
  assert.ok(headerSearchSource.includes('Arrangement.spacedBy("var(--space-2)")'));
  assert.ok(!headerSearchSource.includes("flex items-start gap-2"));
});

test("shared footer and tool stacks use the Compose layout primitives for migrated spacing", () => {
  const footerSource = readSource("../../components/layout/Footer.tsx");
  const expenseSplitterSource = readSource("../../components/tools/expense-splitter/ExpenseSplitter.tsx");
  const contrastCheckerSource = readSource("../../components/tools/contrast-checker/ContrastChecker.tsx");
  const qrCodeGeneratorSource = readSource("../../components/tools/qr-code-generator/QrCodeGenerator.tsx");

  assert.ok(footerSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(footerSource.includes('Arrangement.spacedBy("var(--space-1)")'));
  assert.ok(!footerSource.includes("gap-x-1 gap-y-1"));

  assert.ok(expenseSplitterSource.includes('import { Column } from "@/components/layout/compose/Column"'));
  assert.ok(expenseSplitterSource.includes("verticalArrangement={Arrangement.spacedBy(24)}"));
  assert.ok(!expenseSplitterSource.includes('<div className="space-y-6">'));

  assert.ok(contrastCheckerSource.includes("verticalArrangement={Arrangement.spacedBy(20)}"));
  assert.ok(!contrastCheckerSource.includes('<div className="space-y-5">'));

  assert.ok(qrCodeGeneratorSource.includes("verticalArrangement={Arrangement.spacedBy(20)}"));
  assert.ok(!qrCodeGeneratorSource.includes('<div className="space-y-5">'));
});

const editorialPrimitivesSource = readSource("../../components/tools/ToolPage/EditorialPrimitives.tsx");

test("image metadata tool uses Compose Column arrangements for repeated vertical stacks", () => {
  assert.ok(imageMetadataSource.includes('import { Column } from "@/components/layout/compose/Column"'));
  assert.ok(imageMetadataSource.includes('import { Arrangement } from "@/components/layout/compose/Arrangement"'));
  assert.ok(imageMetadataSource.includes('className="w-full p-5 sm:p-7 lg:p-8"'));
  assert.ok(imageMetadataSource.includes('className="grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]"'), "the main grid must fill the parent Column explicitly");
  assert.ok(imageMetadataSource.includes('className="grid w-full min-w-0 gap-4 rounded-[var(--shape-corner-medium)]'), "each result article must fill its Column slot");
  assert.ok(imageMetadataSource.includes('className="w-full min-w-0"'), "result bodies must fill their grid cell without imposing intrinsic width");
  for (const token of ["--space-6", "--space-4", "--space-3", "--space-2"]) {
    assert.ok(imageMetadataSource.includes(`Arrangement.spacedBy("var(${token})")`), `missing Compose spacing token: ${token}`);
  }
  for (const legacyStack of [
    'className="space-y-6 p-5 sm:p-7 lg:p-8"',
    'className="space-y-4"',
    'className="space-y-3 rounded-[var(--shape-corner-medium)]',
    'className="min-w-0 space-y-2"',
  ]) {
    assert.ok(!imageMetadataSource.includes(legacyStack), `legacy vertical stack remains: ${legacyStack}`);
  }
});

test("editorial callouts reuse the shared filled Card primitive", () => {
  assert.ok(editorialPrimitivesSource.includes('import { Card as SharedCard } from "@/components/ui/Card"'));
  assert.ok(editorialPrimitivesSource.includes('<SharedCard className="mt-4 p-4">'));
  assert.ok(!editorialPrimitivesSource.includes("bg-[var(--accent-soft)]"));
});


test("home, catalogue and tool search consume shared Material 3 typography roles", () => {
  for (const role of ["m3-type-headline-large", "m3-type-body-large", "m3-type-label-large"]) {
    assert.ok(homePageSource.includes(role), `homepage should consume ${role}`);
  }

  for (const role of ["m3-type-display-small", "m3-type-headline-small", "m3-type-title-medium", "m3-type-body-medium", "m3-type-body-small", "m3-type-label-small", "m3-type-label-medium", "m3-type-label-large"]) {
    assert.ok(toolsCatalogueSource.includes(role), `tools catalogue should consume ${role}`);
  }

  for (const role of ["m3-type-title-small", "m3-type-body-large", "m3-type-body-medium", "m3-type-body-small", "m3-type-label-small", "m3-type-label-medium"]) {
    assert.ok(toolSearchSource.includes(role), `tool search should consume ${role}`);
  }

  assert.ok(!toolsCatalogueSource.includes("text-6xl"));
  assert.ok(!toolsCatalogueSource.includes("font-black tracking-[-0.04em]"));
  assert.ok(!toolSearchSource.includes("text-sm font-semibold"));
});


test("admin dashboard content uses shared Material 3 typography roles", () => {
  for (const role of ["m3-type-headline-large", "m3-type-title-large", "m3-type-title-medium", "m3-type-body-large", "m3-type-body-medium", "m3-type-body-small", "m3-type-label-large", "m3-type-label-small"]) {
    assert.ok(adminDashboardSource.includes(role), `admin dashboard should consume ${role}`);
  }

  assert.ok(!adminDashboardSource.includes("text-3xl"));
  assert.ok(!adminDashboardSource.includes("text-sm text-[var(--muted)]"));
  assert.ok(adminUsersSource.includes("m3-type-label-large"));
  assert.ok(!adminUsersSource.includes("text-sm font-semibold"));
});


test("desktop navigation menu uses shared Material 3 typography roles", () => {
  for (const role of ["m3-type-label-large", "m3-type-label-medium", "m3-type-label-small", "m3-type-body-small"]) {
    assert.ok(desktopHeaderMenuSource.includes(role), `desktop header menu should consume ${role}`);
  }

  assert.ok(!desktopHeaderMenuSource.includes("text-[11px]"));
  assert.ok(!desktopHeaderMenuSource.includes("text-sm font-semibold"));
  assert.ok(!desktopHeaderMenuSource.includes("text-xs"));
});


test("tool cards compose their vertical and horizontal layout through shared primitives", () => {
  assert.ok(toolCardSource.includes('import { Column } from "@/components/layout/compose/Column";'));
  assert.ok(toolCardSource.includes('import { Row } from "@/components/layout/compose/Row";'));
  assert.ok(toolCardSource.includes('Arrangement.spacedBy("var(--space-3)")'));
  assert.ok(toolCardSource.includes('<Row horizontalArrangement={Arrangement.Start} className="w-full min-w-0 gap-3">'));
  assert.ok(toolCardSource.includes("m3-type-title-medium"));
  assert.ok(toolCardSource.includes("m3-type-label-small"));
  assert.ok(toolCardSource.includes("m3-type-body-medium"));
  assert.ok(!toolCardSource.includes("flex w-full min-w-0 min-h-40 flex-col"));
  assert.ok(!toolCardSource.includes("body-medium mt-3"));
});


test("search results use shared Material 3 typography roles", () => {
  for (const role of ["m3-type-display-small", "m3-type-headline-small", "m3-type-title-small", "m3-type-body-medium", "m3-type-label-large", "m3-type-label-small"]) {
    assert.ok(searchResultsSource.includes(role), `search results should consume ${role}`);
  }

  assert.ok(!searchResultsSource.includes("text-3xl font-black"));
  assert.ok(!searchResultsSource.includes("text-xl font-bold"));
  assert.ok(!searchResultsSource.includes("text-sm font-semibold"));
  assert.ok(!searchResultsSource.includes("tracking-[-0.055em]"));
});
