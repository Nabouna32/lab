import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const headerSource = readFileSync(new URL("../../components/layout/Header.tsx", import.meta.url), "utf8");
const headerStyles = readFileSync(new URL("../../components/layout/Header.module.css", import.meta.url), "utf8");
const navigationStyles = readFileSync(new URL("../../components/layout/AdaptiveAppNavigation.module.css", import.meta.url), "utf8");
const topAppBarStyles = readFileSync(new URL("../../components/ui/TopAppBar.module.css", import.meta.url), "utf8");
const railStyles = readFileSync(new URL("../../components/ui/NavigationRail.module.css", import.meta.url), "utf8");
const drawerStyles = readFileSync(new URL("../../components/ui/NavigationDrawer.module.css", import.meta.url), "utf8");

test("the header separator belongs to the application shell, not the TopAppBar port", () => {
  assert.match(headerSource, /<div className=\{styles\.shell\} style=\{\{ viewTransitionName: "loculary-header" \}\}>\s*<TopAppBar/);\n  assert.doesNotMatch(headerSource, /<TopAppBar[\\s\\S]*?style=\\{\\{ viewTransitionName:/);
  assert.match(headerStyles, /\.shell::after[\s\S]*?inset-inline:\s*0[\s\S]*?inset-block-end:\s*0[\s\S]*?block-size:\s*1px[\s\S]*?background:\s*var\(--outline-variant\)/);
  assert.doesNotMatch(headerSource, /className="sticky top-0 z-50"/);
  assert.doesNotMatch(topAppBarStyles, /border-(?:bottom|block-end)|::after/);
});

test("desktop navigation separator belongs to the responsive shell for both rail and drawer", () => {
  assert.match(navigationStyles, /\.sidebar::after[\s\S]*?inset-block:\s*0[\s\S]*?inset-inline-end:\s*0[\s\S]*?inline-size:\s*1px[\s\S]*?background:\s*var\(--outline-variant\)/);
  assert.match(navigationStyles, /\.railSlot\s*\{[\s\S]*?flex:\s*1 1 auto/);\n  assert.match(navigationStyles, /@media \(min-width:\s*768px\)[\s\S]*?\.sidebar\s*\{[\s\S]*?display:\s*flex/);
  assert.match(navigationStyles, /@media \(min-width:\s*1200px\)[\s\S]*?\.drawerSlot\s*\{[\s\S]*?display:\s*block/);
  assert.doesNotMatch(railStyles, /border-inline-end|border-right|::after/);
  assert.doesNotMatch(drawerStyles, /border-inline-end|border-right|::after/);
});
