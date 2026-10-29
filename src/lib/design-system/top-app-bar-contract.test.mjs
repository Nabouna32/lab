import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../../components/ui/TopAppBar.tsx", import.meta.url), "utf8");

test("TopAppBar ne rend une navigation que si une action est fournie", () => {
  assert.match(source, /const showNavigation = Boolean\(onNavigationClick\)/);
  assert.match(source, /\{showNavigation \? \(/);
  assert.match(source, /navigationIcon \?\? "menu"/);
  assert.doesNotMatch(source, /navigationIcon = "menu"/);
});
