import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const dropdownSource = readFileSync(new URL("../../components/ui/ExposedDropdownMenu.tsx", import.meta.url), "utf8");
const dropdownCss = readFileSync(new URL("../../components/ui/ExposedDropdownMenu.module.css", import.meta.url), "utf8");
const snackbarSource = readFileSync(new URL("../../components/ui/Snackbar.tsx", import.meta.url), "utf8");
const snackbarCss = readFileSync(new URL("../../components/ui/Snackbar.module.css", import.meta.url), "utf8");
const bottomSheetSource = readFileSync(new URL("../../components/ui/ModalBottomSheet.tsx", import.meta.url), "utf8");
const bottomSheetCss = readFileSync(new URL("../../components/ui/ModalBottomSheet.module.css", import.meta.url), "utf8");
const alertDialogSource = readFileSync(new URL("../../components/ui/AlertDialog.tsx", import.meta.url), "utf8");
const alertDialogCss = readFileSync(new URL("../../components/ui/AlertDialog.module.css", import.meta.url), "utf8");
const checkboxSource = readFileSync(new URL("../../components/ui/Checkbox.tsx", import.meta.url), "utf8");
const switchSource = readFileSync(new URL("../../components/ui/Switch.tsx", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../../components/ui/MaterialIcon.tsx", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const passwordSource = readFileSync(new URL("../../components/tools/password-generator/PasswordGenerator.tsx", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../../components/tools/image-compressor/ImageCompressor.tsx", import.meta.url), "utf8");
const sliderSource = readFileSync(new URL("../../components/ui/Slider.tsx", import.meta.url), "utf8");
const sliderCss = readFileSync(new URL("../../components/ui/slider.module.css", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("../../components/ui/ProgressIndicator.tsx", import.meta.url), "utf8");
const progressCss = readFileSync(new URL("../../components/ui/progress-indicator.module.css", import.meta.url), "utf8");
const validationSource = readFileSync(new URL("../../components/ui/ValidationMessage.tsx", import.meta.url), "utf8");
const textFieldSource = readFileSync(new URL("../../components/ui/TextField.tsx", import.meta.url), "utf8");
const textAreaSource = readFileSync(new URL("../../components/ui/TextArea.tsx", import.meta.url), "utf8");
const selectSource = readFileSync(new URL("../../components/ui/Select.tsx", import.meta.url), "utf8");
const cardSource = readFileSync(new URL("../../components/ui/Card.tsx", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const iconButtonSource = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const panelSource = readFileSync(new URL("../../components/ui/Panel.tsx", import.meta.url), "utf8");
const resultPanelSource = readFileSync(new URL("../../components/ui/ResultPanel.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const headerMenuSource = readFileSync(new URL("../../components/layout/DesktopHeaderMenu.tsx", import.meta.url), "utf8");
const messagesSource = readFileSync(new URL("../i18n/messages.ts", import.meta.url), "utf8");

function luminance(hex) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function literalColors(name) {
  return [...globalCss.matchAll(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6});`, "g"))].map((match) => match[1]);
}

test("custom status foregrounds meet WCAG AA contrast on their light and dark containers", () => {
  for (const status of ["info", "success", "warning"]) {
    const foregrounds = literalColors(status);
    const backgrounds = literalColors(`${status}-soft`);
    assert.equal(foregrounds.length, 2, `${status} should define light and dark foregrounds`);
    assert.equal(backgrounds.length, 2, `${status} should define light and dark containers`);
    for (let themeIndex = 0; themeIndex < 2; themeIndex += 1) {
      const ratio = contrastRatio(foregrounds[themeIndex], backgrounds[themeIndex]);
      assert.ok(ratio >= 4.5, `${status} ${themeIndex === 0 ? "light" : "dark"} contrast is ${ratio.toFixed(2)}:1`);
    }
  }
});

test("shared switch uses native checkbox semantics with the switch role and M3 semantic colors", () => {
  assert.match(switchSource, /role="switch"/);
  assert.ok(switchSource.includes("peer-checked:bg-[var(--switch-active)]"));
  assert.ok(switchSource.includes("peer-checked:after:bg-[var(--switch-on-thumb)]"));
  assert.match(switchSource, /on-surface\) 12%/);
  assert.match(switchSource, /on-surface\) 38%/);
  assert.match(switchSource, /"--switch-active": checked \? "var\(--switch-disabled-selected-track\)"/);
  assert.match(switchSource, /"--switch-track": "var\(--surface-container-highest\)"/);
  assert.ok(switchSource.includes('"--switch-outline": checked ? "transparent" : "var(--switch-disabled-outline)"'));
  assert.match(switchSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(switchSource, /#[0-9a-fA-F]{3,8}/);
});

test("shared checkbox uses M3 foreground/background roles and a visible keyboard focus", () => {
  assert.ok(checkboxSource.includes("peer-checked:bg-[var(--checkbox-active)]"));
  assert.ok(checkboxSource.includes("text-[var(--checkbox-on-active)]"));

  assert.match(checkboxSource, /on-surface\) 38%/);
  assert.match(checkboxSource, /"--checkbox-active": "var\(--checkbox-disabled-active\)"/);
  assert.match(checkboxSource, /peer-focus-visible:ring-2/);
  assert.match(checkboxSource, /borderWidth: disabled \? \(checked \|\| indeterminate \? 0 : 2\) : 1/);
  assert.ok(checkboxSource.includes("color-mix(in srgb, var(--surface) 38%, transparent)"));
  assert.match(checkboxSource, /checkbox-container-shape/);
  assert.match(checkboxSource, /size-\[18px\]/);
  assert.match(checkboxSource, /MaterialIcon name="check" size=\{18\}/);
  assert.doesNotMatch(checkboxSource, /accent-\[#/);
});

test("shared slider and progress indicator expose accessible M3 states", () => {
  assert.match(sliderSource, /type="range"/);
  assert.match(sliderSource, /aria-valuetext=\{valueText\}/);
  assert.match(sliderCss, /height: 48px/);
  assert.match(sliderCss, /height: 4px/);
  assert.match(sliderCss, /width: 20px/);
  assert.match(sliderCss, /height: 20px/);
  assert.match(sliderCss, /border-radius: 50%/);
  assert.match(sliderSource, /data-disabled=\{disabled \? "true" : "false"\}/);
  assert.match(sliderCss, /:focus-visible/);
  assert.ok(sliderSource.includes('"--slider-focus-ring": "var(--focus-ring)"'));
  assert.match(sliderCss, /slider-disabled-active/);
  assert.match(sliderSource, /on-surface\) 12%/);
  assert.match(sliderSource, /on-surface\) 38%/);
  assert.match(progressSource, /role="progressbar"/);
  assert.match(progressSource, /aria-valuenow/);
  assert.match(progressSource, /data-indeterminate=/);
  assert.match(progressCss, /prefers-reduced-motion: reduce/);
  assert.match(progressCss, /background: var\(--progress-track, var\(--primary-container\)\)/);
  assert.match(progressCss, /border-radius: 0/);
  assert.match(labSource, /"--progress-track": "var\(--lab-primary-soft\)"/);
});

test("functional icons use bundled Material Symbols paths and inherit currentColor", () => {
  for (const name of ["content_copy", "restart_alt", "arrow_outward", "lock", "public", "cloud", "warning", "star_fill", "collections_bookmark", "keyboard_arrow_down", "swap_horiz", "apps", "language"]) {
    assert.ok(iconSource.includes(name), `missing Material Symbol: ${name}`);
  }
  assert.match(iconSource, /fill="currentColor"/);
  assert.match(iconSource, /viewBox="0 -960 960 960"/);
});

test("breadcrumbs and collapsible tool sections use Material Symbols instead of text glyphs", () => {
  const breadcrumbsSource = readFileSync(new URL("../../components/layout/Breadcrumbs.tsx", import.meta.url), "utf8");
  const sectionSource = readFileSync(new URL("../../components/tools/ToolPage/ToolSection.tsx", import.meta.url), "utf8");
  const categorySource = readFileSync(new URL("../../components/home/CategoryCard.tsx", import.meta.url), "utf8");
  const languageSource = readFileSync(new URL("../../components/layout/LanguageFlag.tsx", import.meta.url), "utf8");
  const converterSource = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
  assert.match(breadcrumbsSource, /MaterialIcon name="chevron_right"/);
  assert.doesNotMatch(breadcrumbsSource, /›/);
  assert.match(sectionSource, /MaterialIcon name="keyboard_arrow_down"/);
  assert.doesNotMatch(sectionSource, /aria-hidden="true">\+/);
  assert.match(categorySource, /MaterialIcon name="chevron_right"/);
  assert.match(languageSource, /MaterialIcon name="language"/);
  assert.match(converterSource, /MaterialIcon name="swap_horiz"/);
});

test("common navigation and identity icons use the shared Material Symbols component", () => {
  const starSource = readFileSync(new URL("../../components/ui/StarIcon.tsx", import.meta.url), "utf8");
  const collectionSource = readFileSync(new URL("../../components/ui/CollectionIcon.tsx", import.meta.url), "utf8");
  const searchSource = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");
  const headerSource = readFileSync(new URL("../../components/layout/DesktopHeaderMenu.tsx", import.meta.url), "utf8");
  assert.match(starSource, /MaterialIcon name=\{filled \? "star_fill" : "star"\}/);
  assert.match(collectionSource, /MaterialIcon name="collections_bookmark"/);
  assert.match(searchSource, /MaterialIcon name="search"/);
  assert.match(headerSource, /MaterialIcon name="apps"/);
  assert.match(headerSource, /h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-\[var\(--primary-container\)\]/);
  assert.match(headerSource, /bg-\[var\(--tertiary-container\)\] text-\[var\(--on-tertiary-container\)\]/);
  assert.match(headerSource, /t\.nav\.exploreDescription/);
  const messagesSource = readFileSync(new URL("../../lib/i18n/messages.ts", import.meta.url), "utf8");
  assert.match(messagesSource, /exploreDescription: "Parcours tous les outils disponibles"/);
  assert.match(messagesSource, /exploreDescription: "Browse all available tools"/);
  assert.match(headerSource, /t\.nav\.favorites/);
  assert.match(headerSource, /t\.nav\.favoritesDescription/);
  assert.match(headerSource, /t\.nav\.collections/);
  assert.match(headerSource, /t\.nav\.collectionsDescription/);
  assert.doesNotMatch(headerSource, /locale === "fr"|locale === "en"/);
  assert.match(messagesSource, /favorites: "Favoris"/);
  assert.match(messagesSource, /favorites: "Favorites"/);
  assert.match(messagesSource, /collections: "Collections"/);
  assert.match(messagesSource, /collections: "Collections"/);
  assert.match(headerSource, /block text-sm font-semibold text-\[var\(--foreground\)\]/);
  assert.doesNotMatch(headerSource, /function Icon\(/);
});

test("real tools and the Lab use shared checkbox, switch, slider and progress primitives", () => {
  assert.match(labSource, /import \{ Switch \} from "@\/components\/ui\/Switch"/);
  assert.match(labSource, /<Switch /);
  assert.match(labSource, /<Checkbox/);
  assert.match(labSource, /<Slider/);
  assert.match(labSource, /<ProgressIndicator/);
  assert.match(labSource, /lab-disabled-checkbox/);
  assert.match(labSource, /lab-disabled-switch/);
  assert.match(labSource, /lab-disabled-slider/);
  assert.doesNotMatch(labSource, /type="checkbox"/);
  assert.doesNotMatch(labSource, /type="range"/);
  assert.doesNotMatch(labCss, /\.sampleCheck input\s*\{/);
  assert.match(passwordSource, /import \{ Checkbox \} from "@\/components\/ui\/Checkbox"/);
  assert.match(passwordSource, /<Checkbox/);
  assert.match(passwordSource, /import \{ Slider \} from "@\/components\/ui\/Slider"/);
  assert.match(passwordSource, /<Slider/);
  assert.doesNotMatch(passwordSource, /type="checkbox"/);
  assert.doesNotMatch(passwordSource, /type="range"/);
  assert.match(imageSource, /import \{ Slider \} from "@\/components\/ui\/Slider"/);
  assert.match(imageSource, /import \{ ProgressIndicator \} from "@\/components\/ui\/ProgressIndicator"/);
  assert.match(imageSource, /<Slider/);
  assert.match(imageSource, /<ProgressIndicator/);
  assert.doesNotMatch(imageSource, /type="range"/);
});

test("standard functional UI surfaces do not reintroduce one-off inline SVG icons", () => {
  const sharedFunctionalIconCallSites = [
    "../../app/[locale]/compte/page.tsx",
    "../../app/[locale]/design-lab/VisualLab.tsx",
    "../../components/home/CategoryCard.tsx",
    "../../components/layout/DesktopHeaderMenu.tsx",
    "../../components/layout/LanguageFlag.tsx",
    "../../components/layout/MobileHeaderSearch.tsx",
    "../../components/theme/ThemeToggle.tsx",
    "../../components/tools/ToolSearch.tsx",
    "../../components/tools/number-base-converter/NumberBaseConverter.tsx",
  ];

  for (const relativePath of sharedFunctionalIconCallSites) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.doesNotMatch(source, /<svg\b/, `${relativePath} should use the shared MaterialIcon component for standard UI icons`);
  }
});

test("Pixel preview bottom navigation uses readable selected labels and explicit interaction states", () => {
  assert.match(labCss, /\.directionBottomNav button\{[^}]*min-height:3rem/);
  assert.match(labCss, /\.directionStage\[data-direction="fidelity"\] \.directionBottomNav button\[aria-current="page"\]\{color:var\(--lab-text\)\}/);
  assert.match(labCss, /\.directionStage\[data-direction="fidelity"\] \.directionBottomNav button\[aria-current="page"\] b\{background:var\(--lab-secondary-container\);color:var\(--lab-on-secondary-container\)\}/);
  assert.match(labCss, /\.directionStage\[data-direction="fidelity"\] \.directionBottomNav button:hover/);
  assert.match(labCss, /\.directionStage\[data-direction="fidelity"\] \.directionBottomNav button:active/);
  assert.match(labCss, /\.directionStage\[data-direction="fidelity"\] \.directionBottomNav button:focus-visible/);
});

test("shared action controls use semantic state-layer colors instead of brightness filters", () => {
  const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
  const iconButtonSource = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
  const favoriteSource = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
  const accountActionSource = readFileSync(new URL("../../components/account/AccountActionLink.tsx", import.meta.url), "utf8");
  const collectionsSource = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");

  for (const [name, source] of [
    ["Button", buttonSource],
    ["IconButton", iconButtonSource],
    ["FavoriteButton", favoriteSource],
    ["AccountActionLink", accountActionSource],
    ["CollectionsView", collectionsSource],
  ]) {
    assert.doesNotMatch(source, /hover:brightness|filter:brightness|transition-\[[^\]]*filter/ , `${name} should not dim foreground content through a whole-element brightness filter`);
  }

  assert.match(buttonSource, /var\(--primary\)_92%,var\(--on-primary\)/);
  assert.match(buttonSource, /var\(--secondary-container\)_92%,var\(--on-secondary-container\)/);
  assert.match(iconButtonSource, /var\(--primary\)_92%,var\(--on-primary\)/);
  assert.match(favoriteSource, /variant=\{active \? "filled-tonal" : "outlined"\}/);
  assert.match(favoriteSource, /import \{ IconButton \} from "@\/components\/ui\/IconButton"/);
  assert.match(accountActionSource, /var\(--primary\)_92%,var\(--on-primary\)/);
  assert.match(collectionsSource, /var\(--primary\)_92%,var\(--on-primary\)/);
});

test("Fidelity theme source declares the intended scheme and semantic foreground role pairs", () => {
  const tokenSource = readFileSync(new URL("./rainbow-tones.ts", import.meta.url), "utf8");
  assert.match(tokenSource, /new SchemeFidelity\(source, false, 0, SPEC_VERSION, PLATFORM\)/);
  assert.match(tokenSource, /new SchemeFidelity\(source, true, 0, SPEC_VERSION, PLATFORM\)/);
  assert.match(tokenSource, /const SPEC_VERSION = "2025"/);

  const rolePairs = [
    ["primary", "on-primary"],
    ["primary-container", "on-primary-container"],
    ["secondary", "on-secondary"],
    ["secondary-container", "on-secondary-container"],
    ["tertiary", "on-tertiary"],
    ["tertiary-container", "on-tertiary-container"],
    ["error", "on-error"],
    ["error-container", "on-error-container"],
    ["surface", "on-surface"],
    ["background", "on-background"],
    ["inverse-surface", "inverse-on-surface"],
  ];

  for (const [container, foreground] of rolePairs) {
    assert.ok(tokenSource.includes(`${container}:`) || tokenSource.includes(`"${container}":`), `missing Material role ${container}`);
    assert.ok(tokenSource.includes(`${foreground}:`) || tokenSource.includes(`"${foreground}":`), `missing paired foreground role ${foreground}`);
  }
});

test("Design Lab dialog uses a tonal surface and switches follow the selected preview palette", () => {
  assert.match(labCss, /--primary:var\(--lab-primary\)/);
  assert.match(labCss, /--on-primary:var\(--lab-on-primary\)/);
  assert.match(labCss, /--surface-container-highest:var\(--lab-surface-highest\)/);
  assert.match(labCss, /\.dialogPreview\{[^}]*background:var\(--lab-surface-high\);color:var\(--lab-text\)/);
});

test("production theme exposes modern Material 3 surface roles in both themes", () => {
  const tokenSource = readFileSync(new URL("./rainbow-tones.ts", import.meta.url), "utf8");
  for (const [token, role] of [
    ["on-background", "onBackground"],
    ["on-surface", "onSurface"],
    ["surface-dim", "surfaceDim"],
    ["surface-bright", "surfaceBright"],
    ["surface-container-lowest", "surfaceContainerLowest"],
    ["surface-container-low", "surfaceContainerLow"],
    ["surface-container", "surfaceContainer"],
    ["surface-container-high", "surfaceContainerHigh"],
    ["surface-container-highest", "surfaceContainerHighest"],
    ["surface-tint", "surfaceTint"],
  ]) {
    assert.ok(tokenSource.includes(`"${token}": "${role}"`), `missing generated M3 role ${token}`);
  }
  assert.match(globalCss, /--surface-container-highest:\s*var\(--m3-light-surface-container-highest/);
  assert.match(globalCss, /--surface-container-highest:\s*var\(--m3-dark-surface-container-highest/);
});


test("Design Lab includes extended Material 3 navigation, field, list, menu, progress and loading components", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  for (const marker of ["m3-missing-title", "<TopAppBar", "<NavigationRail", "sampleFab", "sampleBadge", "sampleMaterialField", "sampleRadioGroup", "<ListItem", "<DropdownMenu", "<CircularProgressIndicator", "sampleSkeleton", "sampleTooltipWrap"]) {
    assert.ok(labSource.includes(marker), `Design Lab is missing ${marker}`);
  }
  for (const marker of [".sampleTopBar", ".sampleNavigationRail", ".sampleFab", ".sampleMaterialField", ".sampleRadioGroup", ".sampleListItem", ".sampleMenu", ".sampleCircularProgress", ".sampleSkeleton"]) {
    assert.ok(labCss.includes(marker), `Design Lab styles are missing ${marker}`);
  }
  assert.match(labSource, /checked=\{sampleRadio==="all"\}/);
  assert.match(labSource, /sampleMenuLayout==="grid"/);
  assert.match(labSource, /sampleMenuSelected\.includes\("show-grid"\)/);
});


test("Design Lab renders the shared production UI primitives against the active Material 3 scheme", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  for (const component of ["Button", "IconButton", "Card", "Panel", "ResultPanel", "Checkbox", "TextField", "TextArea", "ExposedDropdownMenu", "ModalBottomSheet", "AlertDialog", "SegmentedControl", "ValidationMessage", "Switch"]) {
    assert.match(labSource, new RegExp(`import \\{ ${component} \\} from "@\\/components\\/ui\\/${component}"`), `missing shared component import: ${component}`);
  }
  for (const token of ["--foreground:var(--lab-text)", "--surface:var(--lab-surface)", "--surface-soft:var(--lab-surface-container)", "--secondary-container:var(--lab-secondary-container)", "--error:var(--lab-error)", "--focus-ring:var(--lab-primary)"]) {
    assert.ok(labCss.includes(token), `missing scoped token bridge: ${token}`);
  }
  assert.match(labSource, /aria-labelledby="shared-components-title"/);
});


test("Design Lab does not reference missing CSS module classes", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  const references = [...new Set([...labSource.matchAll(/styles\.([A-Za-z_]\w*)/g)].map((match) => match[1]))];
  for (const className of references) {
    assert.match(labCss, new RegExp(`\\.${className}(?![\\w-])`), `missing CSS module class: ${className}`);
  }
});


test("Section 03 dialog preview trigger uses the shared Material 3 outlined button", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  assert.match(labSource, /aria-labelledby="states-title"[\s\S]*?<Button type="button" variant="outlined" className=\{styles\.dialogPreviewTrigger\} onClick=\{\(\)=>setDialogOpen\(true\)\}>\{t\.confirm\} · dialog<\/Button>/);
  assert.match(labCss, /\.dialogPreviewTrigger\{flex-shrink:0;white-space:nowrap\}/);
});

test("Design Lab follows the resolved application theme instead of owning a second theme selector", () => {
  assert.match(labSource, /import \{ useTheme \} from "@teispace\/next-themes"/);
  assert.match(labSource, /const \{ resolvedTheme \} = useTheme\(\)/);
  assert.match(labSource, /const theme: Theme = resolvedTheme === "dark" \? "dark" : "light"/);
  assert.match(labSource, /roundingDegree\s*,\s*setRoundingDegree/);
  assert.match(labSource, /createLabTokens\(scheme,theme,roundingDegree\)/);
  assert.match(labSource, /inputId="lab-rounding-degree"/);
  assert.match(labSource, /--shape-corner-extra-small/);
  assert.match(labSource, /automaticTheme:!current\.automaticTheme/);
  assert.doesNotMatch(labSource, /aria-pressed=\{theme===/);
  assert.doesNotMatch(labSource, /setTheme\(/);
});

test("static Design Lab validation example does not create an assertive live alert", () => {
  assert.match(validationSource, /role\?: "alert" \| "status" \| null/);
  assert.match(validationSource, /role = "alert"/);
  assert.match(validationSource, /role \? \{ role \} : \{\}/);
  assert.match(labSource, /<ValidationMessage id="lab-shared-validation" role=\{null\}>/);
});

test("outlined form controls use semantic extra-small shape tokens and per-part disabled roles", () => {
  assert.match(globalCss, /--shape-corner-extra-small:\s*4px/);
  assert.match(globalCss, /--shape-corner-small:\s*8px/);
  assert.match(globalCss, /--shape-corner-medium:\s*12px/);
  assert.match(textFieldSource, /rounded-\[var\(--shape-corner-extra-small\)\]/);
  assert.match(textFieldSource, /min-h-14/);
  assert.match(textFieldSource, /step=\{step \?\? \(type === "number" \? "any" : undefined\)\}/);
  assert.match(textAreaSource, /rounded-\[var\(--shape-corner-extra-small\)\]/);
  assert.match(textAreaSource, /variant\?: "fidelity" \| "expressive"/);
  assert.match(textAreaSource, /min-h-\[var\(--m3-size-multiline-text-field-min-height\)\]/);
  assert.match(textAreaSource, /aria-describedby=\{error \? errorId : helperText \? helperId : undefined\}/);
  assert.match(labSource, /variant=\{textAreaVariant\} rows=\{3\}/);
  assert.match(selectSource, /rounded-\[var\(--shape-corner-extra-small\)\]/);
  assert.match(selectSource, /min-h-14/);
  assert.match(cardSource, /shape-corner-medium/);
  assert.match(cardSource, /surface-container-low/);
  assert.match(cardSource, /surface-container-highest/);
  assert.match(cardSource, /focus-visible:ring-2/);
  assert.match(panelSource, /shape-corner-medium/);
  assert.match(resultPanelSource, /shape-corner-medium/);
  for (const [name, source] of [["TextField", textFieldSource], ["TextArea", textAreaSource], ["Select", selectSource]]) {
    assert.match(source, /on-surface\)_12%,transparent/);
    assert.match(source, /on-surface\)_38%,transparent/);
    assert.doesNotMatch(source, /disabled:opacity-60/);
    assert.match(source, /disabled:border-/);
    assert.match(source, /disabled:text-/);
    assert.ok(source.includes("disabled ?"), `${name} label should reflect its disabled state`);
  }
});

test("segmented control keeps labels single-line and leaves descriptions outside the M3 control", () => {
  const segmentedSource = readFileSync(new URL("../../components/ui/SegmentedControl.tsx", import.meta.url), "utf8");
  const percentageSource = readFileSync(new URL("../../components/tools/percentage/PercentageCalculator.tsx", import.meta.url), "utf8");
  const videoBitrateSource = readFileSync(new URL("../../components/tools/video-bitrate/VideoBitrateCalculator.tsx", import.meta.url), "utf8");
  assert.match(segmentedSource, /whitespace-nowrap/);
  assert.match(segmentedSource, /rounded-l-full/);
  assert.match(segmentedSource, /rounded-r-full/);
  assert.match(segmentedSource, /rounded-none/);
  assert.match(segmentedSource, /border-l-0/);
  assert.match(segmentedSource, /disabled=\{item.disabled\}/);
  assert.match(segmentedSource, /on-surface\)_12%,transparent/);
  assert.match(segmentedSource, /on-surface\)_38%,transparent/);
  assert.doesNotMatch(segmentedSource, /description\?: ReactNode|item\.description|opacity-80/);
  assert.match(percentageSource, /modes\.find\(\(item\) => item\.id === mode\)\?\.description/);
  assert.match(videoBitrateSource, /modes\.find\(\(item\) => item\.id === mode\)\?\.description/);
});

test("Design Lab examples keep independent radio and segmented-control state", () => {
  assert.match(labSource, /const \[sampleRadio,setSampleRadio\]=useState\("all"\)/);
  assert.match(labSource, /const \[sampleLayout,setSampleLayout\]=useState\("all"\)/);
  assert.match(labSource, /Disposition de la liste.*?value=\{sampleLayout\} onChange=\{setSampleLayout\}/s);
  assert.match(labSource, /checked=\{sampleRadio==="all"\}/);
});

test("buttons use AndroidX M3 variant-specific disabled roles and icon-toggle selections", () => {
  assert.doesNotMatch(buttonSource, /on-surface\)_10%,transparent/);
  assert.doesNotMatch(buttonSource, /on-surface-variant\)_38%,transparent/);
  assert.match(buttonSource, /const disabledContainer = "disabled:bg-\[color-mix\(in_srgb,var\(--on-surface\)_12%,transparent\)\]"/);
  assert.match(buttonSource, /const disabledContent = "disabled:text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]"/);
  assert.doesNotMatch(buttonSource, /outline-variant\)_10%,transparent/);
  assert.match(buttonSource, /const elevated = .*disabledContainer.*disabledContent.*disabled:shadow-none/);
  assert.match(buttonSource, /const filled = .*disabledContainer.*disabledContent/);
  assert.match(buttonSource, /const outlined = .*disabled:border-\[color-mix\(in_srgb,var\(--on-surface\)_12%,transparent\)\].*disabledContent/);
  assert.match(buttonSource, /const filledTonal = .*disabledContainer.*disabledContent/);
  assert.match(iconButtonSource, /on-surface\)_10%,transparent/);
  assert.match(iconButtonSource, /const filledTonal = .*on-surface\)_10%,transparent/);
  assert.match(iconButtonSource, /outline-variant\)_38%,transparent/);
  assert.match(iconButtonSource, /standard: "text-\[var\(--primary\)\] group-hover:text-\[var\(--primary\)\] group-active:text-\[var\(--primary\)\] group-disabled:text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\] group-hover:bg-/);
  assert.match(iconButtonSource, /"filled-tonal": "bg-\[var\(--secondary\)\] text-\[var\(--on-secondary\)\]/);
  assert.match(iconButtonSource, /outlined: "border-transparent bg-\[var\(--inverse-surface\)\] text-\[var\(--inverse-on-surface\)\]/);
  assert.match(iconButtonSource, /hover:bg-\[color-mix\(in_srgb,var\(--inverse-surface\)_92%,var\(--inverse-on-surface\)\)\]/);
  assert.match(iconButtonSource, /standard: "text-\[var\(--primary\)\] group-hover:text-\[var\(--primary\)\] group-active:text-\[var\(--primary\)\] group-disabled:text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\] group-hover:bg-/);
});

test("Lab checkbox samples each define one palette-aware shape and disabled role set", () => {
  assert.equal((labSource.match(/--checkbox-container-shape/g) || []).length, 2);
  assert.equal((labSource.match(/--checkbox-disabled-active": "color-mix\(in srgb, var\(--lab-text\) 38%, transparent\)"/g) || []).length, 2);
  assert.equal((labSource.match(/--checkbox-disabled-icon": "color-mix\(in srgb, var\(--lab-surface\) 38%, transparent\)"/g) || []).length, 2);
});

test("Design Lab has no stale disabled tokens from the previous control contract", () => {
  assert.doesNotMatch(labSource, /--switch-disabled-track/);
  assert.doesNotMatch(labSource, /--checkbox-disabled-active": "color-mix\(in srgb, var\(--lab-text\) 12%, transparent\)"/);
  assert.doesNotMatch(labSource, /--checkbox-disabled-icon": "color-mix\(in srgb, var\(--lab-text\) 38%, transparent\)"/);
});

test("SegmentedControl follows the AndroidX item-shape and state contract", () => {
  const source = readFileSync(new URL("../../components/ui/SegmentedControl.tsx", import.meta.url), "utf8");
  assert.match(source, /items\.length === 1\s*\? "rounded-full"/);
  assert.match(source, /index === 0\s*\? "rounded-l-full"/);
  assert.match(source, /index === items\.length - 1\s*\? "rounded-r-full"/);
  assert.match(source, /: "rounded-none"/);
  assert.match(source, /min-h-\[var\(--m3-size-segmented-button-min-height\)\]/);
  assert.match(source, /text-\[length:var\(--m3-type-label-large-size\)\]/);
  assert.match(source, /role="radiogroup"/);
  assert.match(source, /role="radio"/);
  assert.match(source, /aria-checked=\{active\}/);
  assert.match(source, /event.key === "ArrowRight"/);
  assert.match(source, /event.key === "Home"/);
  assert.match(source, /bg-\[var\(--secondary-container\)\] text-\[var\(--on-secondary-container\)\]/);
  assert.match(source, /disabled:border-\[color-mix\(in_srgb,var\(--on-surface\)_12%,transparent\)\]/);
  assert.match(source, /disabled:text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]/);
  assert.doesNotMatch(source, /p-1|shadow-\[var\(--shadow-sm\)\]/);
});

test("Design Lab direction preview offers only official M3 Fidelity and M3 Expressive modes", () => {
  assert.match(labSource, /\(\["fidelity","expressive"\] as const\)/);
  assert.match(labSource, /pixelDirection:"M3 Fidelity"/);
  assert.match(labSource, /expressiveDirection:"M3 Expressive"/);
  assert.match(labSource, /direction===\"fidelity\"\?/);
  assert.match(labCss, /directionStage\[data-direction="expressive"\]/);
  assert.match(labCss, /directionStage\[data-direction="fidelity"\]/);
  assert.doesNotMatch(labSource, /Productivité|Productivity|utilityDirection/);
});

test("Button gallery compares shared M3 Fidelity and Expressive component variants", () => {
  assert.match(labSource, /buttonVariant,setButtonVariant/);
  assert.match(labSource, /data-button-variant=\{buttonVariant\}/);
  assert.match(labSource, /buttonFidelity:"M3 Fidelity"/);
  assert.match(labSource, /buttonExpressive:"M3 Expressive"/);
  assert.match(labSource, /buttonVariant==="expressive"&&<p/);
  assert.match(labCss, /galleryCard\[data-button-variant="expressive"\] \.buttonStack > button\{\s*min-height:56px/);
  assert.match(labCss, /padding:16px 24px/);
  assert.match(labCss, /buttonStack > button:active\{\s*border-radius:var\(--shape-corner-medium\)!important/);
});

test("IconButton gallery compares Fidelity and Expressive medium interaction shapes", () => {
  assert.match(labSource, /iconButtonVariant,setIconButtonVariant/);
  assert.match(labSource, /data-icon-button-variant=\{iconButtonVariant\}/);
  assert.match(labSource, /selected=\{sampleIconSelected\}/);
  assert.match(labSource, /setSampleIconSelected/);
  assert.match(labCss, /iconButtonComparison\[data-icon-button-variant="expressive"\] \.buttonStack > button\{\s*width:56px!important/);
  assert.match(labCss, /button\[aria-pressed="true"\]\{\s*border-radius:var\(--shape-corner-large\)!important/);
  assert.match(labCss, /button:active\{\s*border-radius:var\(--shape-corner-medium\)!important/);
  assert.match(labCss, /@media\(prefers-reduced-motion:reduce\)[\s\S]*iconButtonComparison[\s\S]*transition:none/);
});

test("Checkbox offers explicit Fidelity and Expressive choices without inventing a visual delta", () => {
  assert.match(labSource, /checkboxVariant,setCheckboxVariant/);
  assert.match(labSource, /ComponentVariantControl label=\{locale==="fr"\?"Version de la case à cocher":"Checkbox version"\}/);
  assert.match(labSource, /No default Expressive-specific rendering difference was confirmed/);
  assert.match(labCss, /\.componentVariantControl\{display:grid/);
});

test("Switch offers Fidelity and Expressive modes while preserving identical unverified defaults", () => {
  assert.match(labSource, /switchVariant,setSwitchVariant/);
  assert.match(labSource, /Switch version/);
  assert.match(labSource, /Version du switch/);
  assert.match(labSource, /No default Expressive-specific visual difference was confirmed for Switch/);
  assert.match(labSource, /thumb motion will be audited separately/);
});

test("TextField offers source-backed Fidelity and Expressive anatomy without changing the default", () => {
  assert.match(textFieldSource, /variant\?: "fidelity" \| "expressive"/);
  assert.match(textFieldSource, /variant = "fidelity"/);
  assert.match(textFieldSource, /if \(isExpressive\)/);
  assert.match(textFieldSource, /peer-placeholder-shown:top-1\/2/);
  assert.match(textFieldSource, /rounded-\[var\(--shape-corner-extra-large\)\]/);
  assert.match(textFieldSource, /bg-\[var\(--surface-container-highest\)\]/);
  assert.match(labSource, /textFieldVariant,setTextFieldVariant/);
  assert.match(labSource, /variant=\{textFieldVariant\}/);
  assert.match(labSource, /Source-backed Expressive variant: floating inside label/);
});

test("TextField labels reflect invalid state while disabled labels keep disabled color", () => {
  assert.match(textFieldSource, /const isInvalid = !disabled && Boolean\(inputProps\["aria-invalid"\]\);/);
  assert.match(textFieldSource, /isInvalid \? "text-\[var\(--danger\)\]" : "text-\[var\(--foreground\)\]"/);
  assert.match(textFieldSource, /disabled \? "text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]" : isInvalid \? "text-\[var\(--danger\)\] peer-aria-\[invalid=true\]:text-\[var\(--danger\)\]"/);
});

test("TextArea and native Select explicitly expose unfinished Android parity instead of claiming official components", () => {
  assert.match(labSource, /textAreaVariant,setTextAreaVariant/);
  assert.match(labSource, /selectVariant,setSelectVariant/);
  assert.match(labSource, /not a distinct component named TextArea/);
  assert.match(labSource, /Shared component now informed by AndroidX ExposedDropdownMenuBox/);
  assert.match(labSource, /<ExposedDropdownMenu id=\{?"lab-shared-select"?/);
});

test("M3 web reference tokens document Android dp/sp magnitude without claiming physical equivalence", () => {
  assert.match(globalCss, /--m3-ref-unit: 0\.0625rem/);
  assert.match(globalCss, /CSS rem\/px are NOT Android dp\/sp/);
  assert.match(globalCss, /--m3-size-segmented-button-min-height: 2\.5rem/);
  assert.match(globalCss, /--m3-size-snackbar-max-width: 37\.5rem/);
  assert.match(globalCss, /--m3-size-multiline-text-field-min-height: 8rem; \/\* Loculary Web specimen sizing/);
  assert.match(globalCss, /--m3-type-label-large-size: 0\.875rem/);
});

test("M3 Fidelity direction mockup uses semantic shape roles for official component families", () => {
  assert.match(labCss, /directionStage\[data-direction="fidelity"\] \.directionPrimary\{[^}]*border-radius:var\(--shape-corner-full\)/);
  assert.match(labCss, /directionStage\[data-direction="fidelity"\] \.directionCalculator input\{[^}]*border-radius:var\(--shape-corner-extra-small\)/);
  assert.match(labCss, /directionStage\[data-direction="fidelity"\]\{--direction-shape:var\(--shape-corner-medium\)/);
  assert.match(labCss, /directionStage\[data-direction="fidelity"\] \.directionCard,[\s\S]*?border-radius:var\(--shape-corner-medium\)/);
  assert.match(labCss, /directionStage\[data-direction="fidelity"\] \.directionResult\{[^}]*border-radius:var\(--shape-corner-medium\)/);
});


test("Snackbar is a shared AndroidX-informed Web adaptation with honest parity boundaries", () => {
  assert.match(snackbarSource, /Web adaptation of the AndroidX Material 3 Snackbar/);
  assert.match(snackbarSource, /actionLabel/);
  assert.match(snackbarSource, /durationMs = 4000/);
  assert.match(snackbarSource, /if \(!open \|\| hasAction \|\| durationMs <= 0\) return/);
  assert.match(snackbarSource, /role="status" aria-live="polite"/);
  assert.match(snackbarCss, /var\(--lab-inverse-surface, var\(--inverse-surface/);
  assert.match(snackbarCss, /max-width: var\(--m3-size-snackbar-max-width, 37\.5rem\)/);
  assert.match(snackbarCss, /padding: var\(--m3-snackbar-vertical-padding, \.875rem\) var\(--m3-space-2, \.5rem\) var\(--m3-snackbar-vertical-padding, \.875rem\) var\(--m3-space-4, 1rem\)/);
  assert.match(snackbarCss, /shape-corner-extra-small/);
  assert.match(snackbarCss, /prefers-reduced-motion: reduce/);
  assert.match(labSource, /<Snackbar open=\{snackbarOpen\} variant=\{snackbarVariant\}/);
  assert.match(labSource, /queueing, swipe gesture, Scaffold insets and Compose motion remain to be audited/i);
  assert.match(labSource, /Snackbar version/);
});


test("ExposedDropdownMenu is a source-informed Web adaptation with keyboard and ARIA semantics", () => {
  assert.match(dropdownSource, /AndroidX Material 3 ExposedDropdownMenuBox/);
  assert.match(dropdownSource, /role="combobox"/);
  assert.match(dropdownSource, /role="listbox"/);
  assert.match(dropdownSource, /role="option"/);
  assert.match(dropdownSource, /aria-activedescendant/);
  assert.match(dropdownSource, /event.key === "ArrowDown"/);
  assert.match(dropdownSource, /event.key === "ArrowUp"/);
  assert.match(dropdownSource, /event.key === "Home"/);
  assert.match(dropdownSource, /event.key === "End"/);
  assert.match(dropdownSource, /event.key === "Escape"/);
  assert.match(dropdownSource, /event.key === "Tab"/);
  assert.match(dropdownSource, /pointerdown/);
  assert.match(dropdownCss, /var\(--surface-container, var\(--lab-surface-container/);
  assert.match(dropdownCss, /prefers-reduced-motion: reduce/);
  assert.match(labSource, /<ExposedDropdownMenu id="lab-shared-select"/);
});


test("ModalBottomSheet is an accessible AndroidX-informed Web adaptation", () => {
  assert.match(bottomSheetSource, /role="dialog"/);
  assert.match(bottomSheetSource, /aria-modal="true"/);
  assert.match(bottomSheetSource, /aria-labelledby=\{titleId\}/);
  assert.match(bottomSheetSource, /onDismissRef\.current\(\)/);
  assert.match(bottomSheetSource, /event\.key === "Escape"/);
  assert.match(bottomSheetSource, /event\.key !== "Tab"/);
  assert.match(bottomSheetSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(bottomSheetSource, /previousFocus\?\.focus\(\)/);
  assert.match(bottomSheetSource, /AndroidX Material 3 ModalBottomSheet/);
  assert.match(bottomSheetSource, /swipe-to-dismiss, SheetState\/partial expansion/);
  assert.match(bottomSheetCss, /env\(safe-area-inset-bottom/);
  assert.match(bottomSheetCss, /prefers-reduced-motion: reduce/);
  assert.match(bottomSheetCss, /shape-corner-extra-large/);
  assert.match(labSource, /<ModalBottomSheet open=\{bottomSheetOpen\}/);
  assert.doesNotMatch(labSource, /sampleBottomSheetOpen|className=\\{styles\\.sheetHandle\\}/);
});


test("AlertDialog is a source-informed accessible Web adaptation", () => {
  assert.match(alertDialogSource, /role="alertdialog"/);
  assert.match(alertDialogSource, /aria-modal="true"/);
  assert.match(alertDialogSource, /aria-labelledby=\{titleId\}/);
  assert.match(alertDialogSource, /aria-describedby=\{descriptionId\}/);
  assert.match(alertDialogSource, /onDismissRef\.current\(\)/);
  assert.match(alertDialogSource, /event\.key === "Escape"/);
  assert.match(alertDialogSource, /event\.key !== "Tab"/);
  assert.match(alertDialogSource, /document\.body\.style\.overflow = "hidden"/);
  assert.match(alertDialogSource, /previousFocus\?\.focus\(\)/);
  assert.match(alertDialogSource, /AndroidX Material 3 AlertDialog/);
  assert.match(alertDialogCss, /shape-corner-extra-large/);
  assert.match(alertDialogCss, /prefers-reduced-motion: reduce/);
  assert.match(labSource, /import \{ AlertDialog \} from "@\/components\/ui\/AlertDialog"/);
  assert.match(labSource, /<AlertDialog open=\{alertDialogOpen\}/);
  assert.match(labSource, /Show alert dialog|Afficher une alerte/);
});


test("header menu uses a restrained semantic color hierarchy across destinations and settings", () => {
  assert.match(headerMenuSource, /bg-\[var\(--surface-container-high\)\] text-\[var\(--on-surface-variant\)\]/);
  assert.match(headerMenuSource, /bg-\[var\(--primary-container\)\] text-\[var\(--on-primary-container\)\]/);
  assert.match(headerMenuSource, /bg-\[var\(--tertiary-container\)\] text-\[var\(--on-tertiary-container\)\]/);
  assert.match(headerMenuSource, /grid grid-cols-3 gap-1/);
  assert.match(headerMenuSource, /const selected = themeReady && theme === option\.value/);
  assert.match(headerMenuSource, /w-\[min\(18rem,calc\(100vw-1\.5rem\)\)\]/);
});

test("header menu copy uses neutral destination titles and direct descriptions in both locales", () => {
  assert.match(messagesSource, /explore: "Explorer", exploreDescription: "Parcours tous les outils disponibles"/);
  assert.match(messagesSource, /favorites: "Favoris", favoritesDescription: "Tes outils enregistrés"/);
  assert.match(messagesSource, /collections: "Collections", collectionsDescription: "Organise tes outils en groupes"/);
  assert.match(messagesSource, /space: "Compte", menu: "Menu"/);
  assert.match(messagesSource, /explore: "Explore", exploreDescription: "Browse all available tools"/);
  assert.match(messagesSource, /favorites: "Favorites", favoritesDescription: "Your saved tools"/);
  assert.match(messagesSource, /collections: "Collections", collectionsDescription: "Organize your tools into groups"/);
  assert.match(messagesSource, /space: "Account", menu: "Menu"/);
});

test("header theme controls defer client-dependent selected state until after hydration", () => {
  assert.match(headerMenuSource, /function subscribeHydrationReady\(\)/);
  assert.match(headerMenuSource, /function getHydrationReadySnapshot\(\)\s*\{\s*return true;/);
  assert.match(headerMenuSource, /function getServerHydrationReadySnapshot\(\)\s*\{\s*return false;/);
  assert.match(headerMenuSource, /useSyncExternalStore\(\s*subscribeHydrationReady,\s*getHydrationReadySnapshot,\s*getServerHydrationReadySnapshot,/);
  assert.doesNotMatch(headerMenuSource, /setThemeReady/);
  assert.match(headerMenuSource, /aria-pressed=\{selected\}/);
  assert.match(headerMenuSource, /const selected = themeReady && theme === option\.value/);
});
