import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const source = readFileSync(new URL("../../components/ui/NavigationBar.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../../components/ui/NavigationBar.module.css", import.meta.url), "utf8");

test("NavigationBar exposes named navigation, selectable destinations and Material icon labels", () => {
  assert.match(source, /<nav[^>]+aria-label=\{label\}/);
  assert.match(source, /aria-pressed=\{selected\}/);
  assert.match(source, /data-selected=\{selected \? "true" : "false"\}/);
  assert.match(source, /<MaterialIcon name=\{item\.icon\} size=\{24\}/);
  assert.match(source, /onClick=\{\(\) => onSelect\(item\.key\)\}/);
});

test("NavigationBar uses shared semantic roles and preserves Web accessibility adaptations", () => {
  assert.match(css, /var\(--surface-container/);
  assert.match(css, /var\(--on-surface-variant/);
  assert.match(css, /var\(--secondary-container/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});
