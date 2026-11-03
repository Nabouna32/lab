import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { getLocularyThemeStyle } from "./rainbow-tones.ts";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));
const sourceRoot = join(repositoryRoot, "src");

function sourceFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    if (/\.(?:css|ts|tsx|mjs)$/.test(path) && !/\.test\./.test(path)) return [path];
    return [];
  });
}

test("components consume canonical Material 3 roles, not legacy color namespaces", () => {
  const files = sourceFiles(join(sourceRoot, "components"));
  const violations = files
    .filter((path) => /--lab-|--md-sys-color-/.test(readFileSync(path, "utf8")))
    .map((path) => path.replace(repositoryRoot + "/", ""));
  assert.deepEqual(violations, [], "legacy color namespaces remain in components");
});

test("generated Material 3 palette roles have no CSS color fallback", () => {
  const globalCss = readFileSync(join(sourceRoot, "app", "globals.css"), "utf8");
  assert.doesNotMatch(globalCss, /var\(--m3-(?:light|dark)-[a-z-]+\s*,/);
  assert.match(globalCss, /--shadow: var\(--m3-light-shadow\)/);
  assert.match(globalCss, /--scrim: var\(--m3-light-scrim\)/);
  assert.match(globalCss, /--shadow: var\(--m3-dark-shadow\)/);
  assert.match(globalCss, /--scrim: var\(--m3-dark-scrim\)/);
});

test("Material 3 palette generation accepts a configurable seed and validates it", () => {
  const defaultTheme = getLocularyThemeStyle();
  const customTheme = getLocularyThemeStyle("#E91E63");

  assert.notEqual(defaultTheme["--m3-light-primary"], customTheme["--m3-light-primary"]);
  assert.notEqual(defaultTheme["--m3-dark-primary"], customTheme["--m3-dark-primary"]);
  for (const role of [
    "--m3-light-shadow",
    "--m3-dark-shadow",
    "--m3-light-scrim",
    "--m3-dark-scrim",
  ]) {
    assert.ok(defaultTheme[role], `missing generated Material 3 role: ${role}`);
  }
  assert.throws(() => getLocularyThemeStyle("#fff"), TypeError);
});
