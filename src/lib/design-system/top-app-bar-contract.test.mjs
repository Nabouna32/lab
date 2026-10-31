import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../../components/ui/TopAppBar.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../../components/ui/TopAppBar.module.css", import.meta.url), "utf8");

test("TopAppBar small exposes composable title and actions slots without inventing heading semantics", () => {
  assert.match(source, /title: ReactNode/);
  assert.match(source, /actions\?: ReactNode/);
  assert.match(source, /<div className=\{styles\.title\}>\{title\}<\/div>/);
  assert.doesNotMatch(source, /<h2/);
  assert.doesNotMatch(source, /TopAppBarVariant|collapsed|center-aligned|medium|large/);
});

test("TopAppBar navigation is optional and requires a localized accessible label", () => {
  assert.match(source, /onNavigationClick: \(\) => void/);
  assert.match(source, /navigationLabel: string/);
  assert.match(source, /navigationIcon: ReactNode/);
  assert.match(source, /const navigation = "onNavigationClick" in props/);
  assert.match(source, /aria-label=\{navigation\.navigationLabel\}/);
  assert.doesNotMatch(source, /navigationLabel = "Open navigation"/);
});

test("TopAppBar exposes Web content and root styling without leaking layout variants", () => {
  assert.match(source, /contentStyle\?: CSSProperties/);
  assert.match(source, /style\?: CSSProperties/);
  assert.match(source, /style=\{contentStyle\}/);
  assert.match(source, /style=\{style\}/);
});

test("small TopAppBar uses the Material 3 64 px reference and shared titleLarge typography", () => {
  assert.match(styles, /min-height:\s*64px/);
  assert.match(styles, /font-size:\s*var\(--m3-type-title-large-size\)/);
  assert.match(styles, /background:\s*var\(--background, var\(--surface, transparent\)\)/);
});
