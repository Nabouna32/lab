import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const homePageSource = readSource("../../app/[locale]/page.tsx");
const homeWorkflowsSource = readSource("../../components/home/HomeGuidedWorkflows.tsx");
const signInPageSource = readSource("../../app/[locale]/compte/connexion/page.tsx");
const signUpPageSource = readSource("../../app/[locale]/compte/inscription/page.tsx");
const pageLayoutSource = readSource("../../components/layout/PageLayout.tsx");

test("homepage compositions reuse the shared width, gutters and spacing tokens", () => {
  assert.ok(homePageSource.includes('<PageContainer'));
  assert.ok(homePageSource.includes('width="wide"'));
  assert.ok(homePageSource.includes("pb-[var(--space-5)] pt-[var(--space-5)]"));
  assert.ok(homePageSource.includes("sm:pb-[var(--space-8)] sm:pt-[var(--space-8)]"));
  assert.ok(!homePageSource.includes("max-w-[var(--content-wide)]"));
  assert.ok(homeWorkflowsSource.includes('<PageContainer'));
  assert.ok(homeWorkflowsSource.includes('width="wide"'));
  assert.ok(homeWorkflowsSource.includes("pb-[var(--space-8)] pt-[var(--space-2)]"));
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
    assert.ok(!/\\b(?:mt|p|pt|space-y)-(?:[1-8])\\b/.test(source), "raw Tailwind spacing values should not replace shared layout tokens on legal pages");
  }
});
