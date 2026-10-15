import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const lab = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const navigation = readFileSync(new URL("../../components/ui/NavigationBar.tsx", import.meta.url), "utf8");
const navigationCss = readFileSync(new URL("../../components/ui/NavigationBar.module.css", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");

test("Design Lab displays exact component names and identifies specimen fidelity", () => {
  for (const name of [
    "Button", "IconButton", "TextField", "TextArea (Web wrapper)", "ExposedDropdownMenu",
    "Select (native HTML wrapper)", "ClearButton", "CopyButton", "Checkbox", "Switch",
    "Slider", "ProgressIndicator", "SegmentedControl", "ValidationMessage", "Card",
    "Panel", "ResultPanel", "Snackbar", "ModalBottomSheet", "AlertDialog", "NavigationBar",
  ]) {
    assert.ok(lab.includes(name), `Missing visible component identifier: ${name}`);
  }
  assert.match(lab, /kind = "shared"/);
  assert.match(lab, /kind === "adaptation"/);
  assert.match(lab, /Local mockup/);
  assert.match(lab, /Maquette locale/);
  assert.match(labCss, /\.componentIdentifier/);
  assert.match(labCss, /data-kind="adaptation"/);
  assert.match(labCss, /data-kind="mockup"/);
});

test("The progress gallery uses the shared linear primitive and labels the circular mockup honestly", () => {
  assert.match(lab, /<ProgressIndicator label=\{locale===/);
  assert.match(lab, /value=\{sampleProgress\}/);
  assert.match(lab, /names=\{\["CircularProgressIndicator \(mockup\)"/);
  assert.doesNotMatch(lab, /names=\{\["CircularProgressIndicator \(mockup\)","LinearProgressIndicator \(mockup\)"/);
});
test("The shared NavigationBar is integrated in the phone preview and interactive gallery", () => {
  assert.match(lab, /import \{ NavigationBar \} from "@\/components\/ui\/NavigationBar"/);
  assert.equal((lab.match(/<NavigationBar/g) ?? []).length, 2);
  assert.match(lab, /selectedKey=\{screen==="explore"\|\|screen==="saved"\|\|screen==="profile"\?screen:"home"\}/);
  assert.match(lab, /onSelect=\{setNavigationSelection\}/);
  assert.match(navigation, /aria-label=\{label\}/);
  assert.match(navigation, /aria-current=\{selected \? "page" : undefined\}/);
  assert.match(navigation, /onClick=\{\(\) => onSelect\(item\.key\)\}/);
  assert.match(navigationCss, /var\(--lab-surface-container/);
  assert.match(navigationCss, /var\(--lab-secondary-container/);
  assert.match(navigationCss, /env\(safe-area-inset-bottom\)/);
  assert.match(navigationCss, /:focus-visible/);
  assert.match(navigationCss, /prefers-reduced-motion:\s*reduce/);
});
