import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const lab = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const navigation = readFileSync(new URL("../../components/ui/NavigationBar.tsx", import.meta.url), "utf8");
const navigationCss = readFileSync(new URL("../../components/ui/NavigationBar.module.css", import.meta.url), "utf8");
const tabs = readFileSync(new URL("../../components/ui/Tabs.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");

test("Design Lab displays exact component names and identifies specimen fidelity", () => {
  for (const name of [
    "Button", "IconButton", "TextField", "TextArea (Web wrapper)", "ExposedDropdownMenu",
    "Select (native HTML wrapper)", "ClearButton", "CopyButton", "Checkbox", "Switch",
    "Slider", "ProgressIndicator", "SegmentedControl", "ValidationMessage", "Card",
    "Panel", "ResultPanel", "Snackbar", "ModalBottomSheet", "AlertDialog", "NavigationBar", "NavigationRail", "NavigationDrawer", "CircularProgressIndicator", "FloatingActionButton", "Badge", "BadgedBox", "Tooltip", "Carousel", "TopAppBar", "BottomAppBar", "Scaffold", "ListItem", "HorizontalDivider", "VerticalDivider", "AssistChip", "FilterChip", "InputChip", "SuggestionChip", "RadioButton", "Tab", "PrimaryTabRow", "SecondaryTabRow", "PrimaryScrollableTabRow", "SecondaryScrollableTabRow", "DatePicker", "DateRangePicker", "TimePicker", "TimeInput (native HTML input wrapper)", "SearchBar", "ExpandedDockedSearchBar", "ExpandedFullScreenSearchBar", "TriStateCheckbox", "RangeSlider",
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

test("The progress gallery uses shared linear and circular progress primitives", () => {
  assert.match(lab, /<ProgressIndicator label=\{locale===/);
  assert.match(lab, /value=\{sampleProgress\}/);
  assert.match(lab, /names=\{\["CircularProgressIndicator","ProgressIndicator"\]\} kind="adaptation"/);
  assert.match(lab, /<CircularProgressIndicator label=\{locale===/);
  assert.doesNotMatch(lab, /CircularProgressIndicator \(mockup\)/);
});
test("NavigationRail, NavigationDrawer and CircularProgressIndicator are integrated as Web adaptations", () => {
  assert.match(lab, /import \{ NavigationRail \} from "@\/components\/ui\/NavigationRail"/);
  assert.match(lab, /import \{ NavigationDrawer \} from "@\/components\/ui\/NavigationDrawer"/);
  assert.match(lab, /import \{ CircularProgressIndicator \} from "@\/components\/ui\/CircularProgressIndicator"/);
  assert.match(lab, /import \{ FloatingActionButton \} from "@\/components\/ui\/FloatingActionButton"/);
  assert.match(lab, /import \{ Badge, BadgedBox \} from "@\/components\/ui\/Badge"/);
  assert.match(lab, /import \{ Tooltip \} from "@\/components\/ui\/Tooltip"/);
  assert.match(lab, /import \{ Carousel \} from "@\/components\/ui\/Carousel"/);
  assert.match(lab, /import \{ TopAppBar \} from "@\/components\/ui\/TopAppBar"/);
  assert.match(lab, /import \{ BottomAppBar \} from "@\/components\/ui\/BottomAppBar"/);
  assert.match(lab, /import \{ Scaffold \} from "@\/components\/ui\/Scaffold"/);
  assert.match(lab, /import \{ Divider \} from "@\/components\/ui\/Divider"/);
  assert.match(lab, /import \{ ListItem \} from "@\/components\/ui\/ListItem"/);
  assert.match(lab, /import \{ Chip \} from "@\/components\/ui\/Chip"/);
  assert.match(lab, /import \{ RadioButton \} from "@\/components\/ui\/RadioButton"/);
  assert.match(lab, /names=\{\["RadioButton"\]\} kind="adaptation"/);
  assert.match(lab, /<RadioButton name="lab-filter"/);
  assert.match(lab, /names=\{\["AssistChip","ElevatedAssistChip","FilterChip","ElevatedFilterChip","InputChip","SuggestionChip","ElevatedSuggestionChip"\]\} kind="adaptation"/);
  assert.match(lab, /<Chip variant="elevated-filter"/);
  assert.match(lab, /<Chip variant="input"/);
  assert.match(lab, /names=\{\["ListItem","HorizontalDivider","VerticalDivider"\]\} kind="adaptation"/);
  assert.match(lab, /<Divider orientation="vertical"\/>/);
  assert.match(lab, /names=\{\["Scaffold"\]\} kind="adaptation"/);
  assert.match(lab, /<Scaffold className=\{styles\.scaffoldPreview\}/);
  assert.match(lab, /names=\{\["BottomAppBar"\]\} kind="adaptation"/);
  assert.match(lab, /names=\{\["TopAppBar"\]\} kind="adaptation"/);
  assert.match(lab, /variant="center-aligned"/);
  assert.match(lab, /variant="medium"/);
  assert.match(lab, /variant="large"/);
  assert.match(lab, /names=\{\["HorizontalUncontainedCarousel","HorizontalMultiBrowseCarousel"\]\} kind="adaptation"/);
  assert.match(lab, /layout="multi-browse"/);
  assert.match(lab, /names=\{\["PlainTooltip","RichTooltip","TooltipBox"\]\} kind="adaptation"/);
  assert.match(lab, /<Tooltip variant="rich"/);
  assert.match(lab, /names=\{\["Badge","BadgedBox"\]\} kind="adaptation"/);
  assert.match(lab, /<BadgedBox badge=\{/);
  assert.match(lab, /names=\{\["SmallFloatingActionButton","FloatingActionButton","LargeFloatingActionButton","ExtendedFloatingActionButton"\]\} kind="adaptation"/);
  assert.match(lab, /<FloatingActionButton size="extended"/);
  assert.match(lab, /<NavigationRail label=/);
  assert.match(lab, /<NavigationDrawer open=\{sampleDrawerOpen\}/);
  assert.match(lab, /<CircularProgressIndicator label=/);
  assert.match(lab, /names=\{\["NavigationRail"\]\} kind="adaptation"/);
  assert.match(lab, /names=\{\["CircularProgressIndicator","ProgressIndicator"\]\} kind="adaptation"/);
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


test("Material 3 tab specimens use the shared tabs adaptation and expose keyboard behavior", () => {
  assert.match(lab, /import \{ Tabs \} from "@\/components\/ui\/Tabs"/);
  assert.match(lab, /variant="primary"/);
  assert.match(lab, /variant="secondary" scrollable/);
  assert.doesNotMatch(lab, /className=\{styles\.tabRow\} role="tablist"/);
  assert.match(tabs, /ArrowLeft/);
  assert.match(tabs, /ArrowRight/);
  assert.match(tabs, /aria-controls=\{item\.content/);
  assert.match(tabs, /role="tabpanel"/);
  assert.match(tabs, /useId/);
});


test("Date picker families are represented by a shared documented Web adaptation", () => {
  assert.match(lab, /import \{ DatePicker \} from "@\/components\/ui\/DatePicker"/);
  assert.match(lab, /mode="range"/);
  assert.match(lab, /displayMode="input"/);
  assert.match(lab, /DatePicker \(native HTML input wrapper\)/);
});


test("Time picker dial and native input wrapper are represented in the Lab", () => {
  assert.match(lab, /import \{ TimePicker \} from "@\/components\/ui\/TimePicker"/);
  assert.match(lab, /displayMode="dial"/);
  assert.match(lab, /displayMode="input"/);
  assert.match(lab, /TimeInput \(native HTML input wrapper\)/);
});


test("Search bar specimens use the shared query, suggestion and expanded-state adaptation", () => {
  assert.match(lab, /import \{ SearchBar \} from "@\/components\/ui\/SearchBar"/);
  assert.match(lab, /mode="full-screen"/);
  assert.match(lab, /suggestions=/);
  assert.match(lab, /SearchBar/);
});


test("TriStateCheckbox has a native indeterminate state and a shared Lab specimen", () => {
  assert.match(lab, /import \{ TriStateCheckbox \} from "@\/components\/ui\/TriStateCheckbox"/);
  assert.match(lab, /state=\{sampleTriState\}/);
  assert.match(lab, /TriStateCheckbox/);
});


test("RangeSlider is integrated as a shared range-selection adaptation", () => {
  assert.match(lab, /import \{ RangeSlider \} from "@\/components\/ui\/RangeSlider"/);
  assert.match(lab, /value=\{sampleRange\}/);
  assert.match(lab, /minGap=\{5\}/);
});
