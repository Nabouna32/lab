import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("../../app/[locale]/page.tsx", import.meta.url), "utf8");

test("homepage remains localized and exposes the primary page landmark", () => {
  assert.match(homeSource, /export default async function HomePage/);
  assert.match(homeSource, /isLocale\(locale\)/);
  assert.match(homeSource, /getMessages\(locale\)/);
  assert.match(homeSource, /<main\b/);
  assert.match(homeSource, /aria-labelledby=/);
});

test("homepage metadata is generated from the active locale", () => {
  assert.match(homeSource, /export async function generateMetadata/);
  assert.match(homeSource, /getPublicPageMetadata/);
  assert.match(homeSource, /title: t\.home\.metaTitle/);
  assert.match(homeSource, /description: t\.home\.description/);
  assert.match(homeSource, /path: `\/\$\{locale\}`/);
});

const messagesSource = readFileSync(new URL("../i18n/messages.ts", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../../components/layout/Header.tsx", import.meta.url), "utf8");
const headerSearchSource = readFileSync(new URL("../../components/layout/HeaderSearch.tsx", import.meta.url), "utf8");
const guidedWorkflowsSource = readFileSync(new URL("../../components/home/HomeGuidedWorkflows.tsx", import.meta.url), "utf8");
const searchResultsSource = readFileSync(new URL("../../components/tools/SearchResultsClient.tsx", import.meta.url), "utf8");

test("homepage keeps search, recent tools, guided workflows and catalogue discovery available", () => {
  assert.match(homeSource, /<ToolSearch locale=\{locale\} instanceId="home-tool-search-v4"/);
  assert.match(homeSource, /<RecentTools locale=\{locale\}/);
  assert.match(homeSource, /<HomeGuidedWorkflows locale=\{locale\}/);
  assert.match(homeSource, /t\.home\.explore/);
  assert.match(messagesSource, /quickLinksLabel/);
  assert.match(searchResultsSource, /t\.home\.quickLinks/);
  assert.match(searchResultsSource, /t\.home\.quickLinksLabel/);
  assert.match(messagesSource, /explore:/);
});

test("global header search remains icon-triggered and keyboard-accessible", () => {
  assert.match(headerSource, /import HeaderSearch from "@\/components\/layout\/HeaderSearch"/);
  assert.doesNotMatch(headerSource, /ToolSearch|grid-cols-\[1fr_minmax/);
  assert.match(headerSearchSource, /<IconButton/);
  assert.match(headerSearchSource, /aria-expanded=\{open\}/);
  assert.match(headerSearchSource, /input\.focus\(\)/);
  assert.doesNotMatch(headerSearchSource, /lg:hidden|md:hidden|sm:hidden/);
});

test("guided workflow cards retain Material 3 semantics and reduced-motion support", () => {
  assert.ok(guidedWorkflowsSource.includes('import { CardLink } from "@/components/ui/Card";'));
  assert.ok(guidedWorkflowsSource.includes("bg-[var(--primary-container)] text-[var(--on-primary-container)]"));
  assert.ok(guidedWorkflowsSource.includes("text-[var(--on-surface)]"));
  assert.ok(guidedWorkflowsSource.includes("text-[var(--on-surface-variant)]"));
  assert.ok(guidedWorkflowsSource.includes('Arrangement.spacedBy("var(--layout-item-gap)")'));
  assert.ok(guidedWorkflowsSource.includes('MaterialIcon name="swap_horiz" size={24}'));
  assert.ok(guidedWorkflowsSource.includes("motion-reduce:transition-none"));
  assert.doesNotMatch(guidedWorkflowsSource, /var\(--accent(?:-soft|-foreground)?\)/);
});
