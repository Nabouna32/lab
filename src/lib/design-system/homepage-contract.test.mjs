import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("../../app/[locale]/page.tsx", import.meta.url), "utf8");
const globalStylesSource = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const rainbowTonesSource = readFileSync(new URL("./rainbow-tones.ts", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../../components/layout/Header.tsx", import.meta.url), "utf8");
const headerSearchSource = readFileSync(new URL("../../components/layout/HeaderSearch.tsx", import.meta.url), "utf8");
const messagesSource = readFileSync(new URL("../i18n/messages.ts", import.meta.url), "utf8");
const searchResultsSource = readFileSync(new URL("../../components/tools/SearchResultsClient.tsx", import.meta.url), "utf8");

test("homepage prioritizes its main search, recent tools, guided workflows and Explorer CTA", () => {
  assert.match(homeSource, /<ToolSearch locale=\{locale\} instanceId="home-tool-search-v4"/);
  assert.match(homeSource, /<RecentTools locale=\{locale\}/);
  assert.match(homeSource, /<HomeGuidedWorkflows locale=\{locale\}/);
  assert.match(homeSource, /t\.home\.explore/);
  assert.doesNotMatch(homeSource, /quickLinks|quick-links/);
  assert.match(messagesSource, /quickLinksLabel/);
  assert.match(searchResultsSource, /t\.home\.quickLinks/);
  assert.match(searchResultsSource, /t\.home\.quickLinksLabel/);
  assert.match(messagesSource, /explore:/);
});

test("homepage hero uses the shared Material card instead of the bespoke rainbow frame", () => {
  assert.match(homeSource, /import \{ ElevatedCard \} from "@\/components\/ui\/Card"/);
  assert.match(homeSource, /<ElevatedCard/);
  assert.doesNotMatch(homeSource, /home-rainbow-frame|home-command-surface|getRainbowFrameStyle/);
  assert.doesNotMatch(globalStylesSource, /home-rainbow-frame|home-command-surface/);
  assert.doesNotMatch(rainbowTonesSource, /getRainbowFrameStyle|home-rainbow/);
});

test("global header search is icon-triggered at every breakpoint without a second desktop input", () => {
  assert.match(headerSource, /import HeaderSearch from "@\/components\/layout\/HeaderSearch"/);
  assert.doesNotMatch(headerSource, /ToolSearch|grid-cols-\[1fr_minmax/);
  assert.match(headerSearchSource, /<IconButton/);
  assert.match(headerSearchSource, /aria-expanded=\{open\}/);
  assert.match(headerSearchSource, /input\.focus\(\)/);
  assert.doesNotMatch(headerSearchSource, /lg:hidden|md:hidden|sm:hidden/);
});
