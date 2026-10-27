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

test("homepage compositions reuse the shared width, gutters and spacing tokens", () => {
  assert.ok(homePageSource.includes('<PageContainer'));
  assert.ok(homePageSource.includes('width="wide"'));
  assert.ok(homePageSource.includes("pb-[var(--space-5)] pt-[var(--space-5)]"));
  assert.ok(homePageSource.includes("sm:pb-[var(--space-8)] sm:pt-[var(--space-8)]"));
  assert.ok(!homePageSource.includes("max-w-[var(--content-wide)]"));
  assert.ok(homeWorkflowsSource.includes('<PageContainer'));
  assert.ok(homeWorkflowsSource.includes('width="wide"'));
  assert.ok(homeWorkflowsSource.includes("pb-[var(--space-8)] pt-[var(--space-2)]"));
  assert.ok(homeWorkflowsSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(homeWorkflowsSource.includes('import { Box } from "@/components/layout/compose/Box"'));
  assert.ok(homeWorkflowsSource.includes("contentAlignment={Alignment.Center}"));
  assert.ok(homeWorkflowsSource.includes('aria-hidden="true"'));
  assert.ok(homeWorkflowsSource.includes('Arrangement.spacedByCss("var(--home-workflow-card-gap)")'));
  assert.ok(homeWorkflowsSource.includes("[--home-workflow-card-gap:var(--space-3)] sm:[--home-workflow-card-gap:var(--space-4)]"));
  assert.ok(!homeWorkflowsSource.includes("group flex min-h-20 items-center gap-3"));
  assert.ok(!homeWorkflowsSource.includes("px-4 sm:px-6 lg:px-10"));
});

test("signed-in states on sign-in and sign-up pages use the shared account container", () => {
  for (const source of [signInPageSource, signUpPageSource]) {
    assert.ok(source.includes('width="account"'));
    assert.ok(source.includes("min-h-[calc(100vh-4.5rem)]"));
    assert.ok(source.includes("py-[var(--space-12)]"));
    assert.ok(source.includes('width="form"'), "the actual auth form keeps its narrower form width");
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
  assert.ok(headerSource.includes('Arrangement.spacedByCss("var(--header-layout-gap)")'));
  assert.ok(headerSource.includes('Arrangement.spacedByCss("var(--header-control-gap)")'));
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
  assert.ok(headerSearchSource.includes('Arrangement.spacedByCss("var(--space-2)")'));
  assert.ok(!headerSearchSource.includes("flex items-start gap-2"));
});

test("shared footer and tool stacks use the Compose layout primitives for migrated spacing", () => {
  const footerSource = readSource("../../components/layout/Footer.tsx");
  const expenseSplitterSource = readSource("../../components/tools/expense-splitter/ExpenseSplitter.tsx");
  const contrastCheckerSource = readSource("../../components/tools/contrast-checker/ContrastChecker.tsx");
  const qrCodeGeneratorSource = readSource("../../components/tools/qr-code-generator/QrCodeGenerator.tsx");

  assert.ok(footerSource.includes('import { Row } from "@/components/layout/compose/Row"'));
  assert.ok(footerSource.includes('Arrangement.spacedByCss("var(--space-1)")'));
  assert.ok(!footerSource.includes("gap-x-1 gap-y-1"));

  assert.ok(expenseSplitterSource.includes('import { Column } from "@/components/layout/compose/Column"'));
  assert.ok(expenseSplitterSource.includes("verticalArrangement={Arrangement.spacedBy(24)}"));
  assert.ok(!expenseSplitterSource.includes('<div className="space-y-6">'));

  assert.ok(contrastCheckerSource.includes("verticalArrangement={Arrangement.spacedBy(20)}"));
  assert.ok(!contrastCheckerSource.includes('<div className="space-y-5">'));

  assert.ok(qrCodeGeneratorSource.includes("verticalArrangement={Arrangement.spacedBy(20)}"));
  assert.ok(!qrCodeGeneratorSource.includes('<div className="space-y-5">'));
});
