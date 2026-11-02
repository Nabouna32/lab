import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../../components/ui/", import.meta.url);
const preservedPorts = [
  "Carousel",
  "ModalBottomSheet",
  "BottomSheetScaffold",
  "PullToRefreshBox",
  "SwipeToDismissBox",
  "Scaffold",
  "NavigationSuiteScaffold",
  "NavigationDrawer",
  "NavigationRail",
  "WideNavigationRail",
  "SearchBar",
  "Snackbar",
  "BottomAppBar",
  "FloatingActionButton",
  "FloatingActionButtonMenu",
];

test("previously started AndroidX Material 3 port adaptations remain in the shared catalogue", () => {
  for (const name of preservedPorts) {
    const sourcePath = new URL(`${name}.tsx`, root);
    const stylePath = new URL(`${name}.module.css`, root);
    assert.ok(existsSync(sourcePath), `missing preserved port source: ${name}`);
    assert.ok(existsSync(stylePath), `missing preserved port styles: ${name}`);

    const source = readFileSync(sourcePath, "utf8");
    const styles = readFileSync(stylePath, "utf8");
    assert.match(source, new RegExp(`export function ${name}\\b`), `missing component export: ${name}`);
    assert.ok(styles.trim().length > 0, `empty component styles: ${name}`);
  }
});

test("Expressive beta candidates stay separate from the Fidelity Snackbar contract", () => {
  const fabMenu = readFileSync(new URL("FloatingActionButtonMenu.tsx", root), "utf8");
  const snackbar = readFileSync(new URL("Snackbar.tsx", root), "utf8");
  const snackbarCss = readFileSync(new URL("Snackbar.module.css", root), "utf8");
  const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

  assert.match(fabMenu, /1\.5\.0-beta02/);
  assert.match(fabMenu, /Experimental candidate port/);
  assert.doesNotMatch(snackbar, /SnackbarVariant|variant\?:|data-variant/);
  assert.doesNotMatch(snackbarCss, /data-variant/);
  for (const token of [
    "--m3-size-snackbar-single-line-height:",
    "--m3-size-snackbar-two-line-height:",
    "--m3-size-snackbar-max-width:",
    "--m3-snackbar-vertical-padding:",
  ]) {
    assert.ok(globalCss.includes(token), `missing restored Snackbar reference token: ${token}`);
  }
});
