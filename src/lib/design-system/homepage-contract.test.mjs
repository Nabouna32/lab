import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const homeSource = readFileSync(new URL("../../app/[locale]/page.tsx", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../../components/layout/Header.tsx", import.meta.url), "utf8");
const headerSearchSource = readFileSync(new URL("../../components/layout/HeaderSearch.tsx", import.meta.url), "utf8");
const messagesSource = readFileSync(new URL("../i18n/messages.ts", import.meta.url), "utf8");

test("homepage prioritizes its main search, recent tools, guided workflows and Explorer CTA", () => {
  assert.match(homeSource, /<ToolSearch locale=\{locale\} instanceId="home-tool-search-v4"/);
  assert.match(homeSource, /<RecentTools locale=\{locale\}/);
  assert.match(homeSource, /<HomeGuidedWorkflows locale=\{locale\}/);
  assert.match(homeSource, /t\.home\.explore/);
  assert.doesNotMatch(homeSource, /quickLinks|quick-links|Accès directs aux outils/);
  assert.doesNotMatch(messagesSource, /quickLinksLabel|quickLinks:/);
  assert.match(messagesSource, /explore: "Explorer tous les outils"/);
  assert.match(messagesSource, /explore: "Explore all tools"/);
});

test("global header search is icon-triggered at every breakpoint without a second desktop input", () => {
  assert.match(headerSource, /import HeaderSearch from "@\/components\/layout\/HeaderSearch"/);
  assert.match(headerSource, /grid-cols-\[1fr_auto\]/);
  assert.doesNotMatch(headerSource, /ToolSearch|grid-cols-\[1fr_minmax/);
  assert.match(headerSearchSource, /<IconButton/);
  assert.match(headerSearchSource, /aria-expanded=\{open\}/);
  assert.match(headerSearchSource, /input\.focus\(\)/);
  assert.doesNotMatch(headerSearchSource, /lg:hidden|md:hidden|sm:hidden/);
});
