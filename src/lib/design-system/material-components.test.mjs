import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const checkboxSource = readFileSync(new URL("../../components/ui/Checkbox.tsx", import.meta.url), "utf8");
const switchSource = readFileSync(new URL("../../components/ui/Switch.tsx", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../../components/ui/MaterialIcon.tsx", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
const passwordSource = readFileSync(new URL("../../components/tools/password-generator/PasswordGenerator.tsx", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../../components/tools/image-compressor/ImageCompressor.tsx", import.meta.url), "utf8");
const sliderSource = readFileSync(new URL("../../components/ui/Slider.tsx", import.meta.url), "utf8");
const sliderCss = readFileSync(new URL("../../components/ui/slider.module.css", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("../../components/ui/ProgressIndicator.tsx", import.meta.url), "utf8");
const progressCss = readFileSync(new URL("../../components/ui/progress-indicator.module.css", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../../components/tools/image-compressor/ImageCompressor.tsx", import.meta.url), "utf8");
const sliderSource = readFileSync(new URL("../../components/ui/Slider.tsx", import.meta.url), "utf8");
const sliderCss = readFileSync(new URL("../../components/ui/slider.module.css", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("../../components/ui/ProgressIndicator.tsx", import.meta.url), "utf8");
const progressCss = readFileSync(new URL("../../components/ui/progress-indicator.module.css", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

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
  assert.match(switchSource, /"--switch-active": "var\(--switch-disabled-track\)"/);
  assert.match(switchSource, /bg-\[var\(--surface-container-highest\)\]/);
  assert.match(switchSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(switchSource, /#[0-9a-fA-F]{3,8}/);
});

test("shared checkbox uses M3 foreground/background roles and a visible keyboard focus", () => {
  assert.ok(checkboxSource.includes("peer-checked:bg-[var(--checkbox-active)]"));
  assert.ok(checkboxSource.includes("text-[var(--checkbox-on-active)]"));
  assert.match(checkboxSource, /on-surface\) 12%/);
  assert.match(checkboxSource, /on-surface\) 38%/);
  assert.match(checkboxSource, /"--checkbox-active": "var\(--checkbox-disabled-active\)"/);
  assert.match(checkboxSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(checkboxSource, /accent-\[#/);
});

test("shared slider and progress indicator expose accessible M3 states", () => {
  assert.match(sliderSource, /type="range"/);
  assert.match(sliderSource, /aria-valuetext=\{valueText\}/);
  assert.match(sliderCss, /height: 48px/);
  assert.match(sliderSource, /data-disabled=\{disabled \? "true" : "false"\}/);
  assert.match(sliderCss, /:focus-visible/);
  assert.match(sliderCss, /slider-disabled-active/);
  assert.match(sliderSource, /on-surface\) 12%/);
  assert.match(sliderSource, /on-surface\) 38%/);
  assert.match(progressSource, /role="progressbar"/);
  assert.match(progressSource, /aria-valuenow/);
  assert.match(progressSource, /data-indeterminate=/);
  assert.match(progressCss, /prefers-reduced-motion: reduce/);
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
  assert.match(labSource, /<Checkbox/);\n  assert.match(labSource, /<Slider/);\n  assert.match(labSource, /<ProgressIndicator/);\n  assert.match(labSource, /lab-disabled-checkbox/);\n  assert.match(labSource, /lab-disabled-switch/);\n  assert.match(labSource, /lab-disabled-slider/);\n  assert.doesNotMatch(labSource, /type="checkbox"/);\n  assert.doesNotMatch(labSource, /type="range"/);
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
  assert.doesNotMatch(imageSource, /type="range"/);\n  assert.match(passwordSource, /import \\{ Slider \\} from "@\\/components\\/ui\\/Slider"/);\n  assert.match(passwordSource, /<Slider/);\n  assert.doesNotMatch(passwordSource, /type="checkbox"/);\n  assert.doesNotMatch(passwordSource, /type="range"/);\n  assert.match(imageSource, /<Slider/);\n  assert.match(imageSource, /<ProgressIndicator/);\n  assert.doesNotMatch(imageSource, /type="range"/);
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
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
  assert.match(labCss, /\.directionBottomNav button\{[^}]*min-height:3rem/);
  assert.match(labCss, /\.directionStage\[data-direction="pixel"\] \.directionBottomNav button\[aria-current="page"\]\{color:var\(--lab-text\)\}/);
  assert.match(labCss, /\.directionStage\[data-direction="pixel"\] \.directionBottomNav button\[aria-current="page"\] b\{background:var\(--lab-secondary-container\);color:var\(--lab-on-secondary-container\)\}/);
  assert.match(labCss, /\.directionStage\[data-direction="pixel"\] \.directionBottomNav button:hover/);
  assert.match(labCss, /\.directionStage\[data-direction="pixel"\] \.directionBottomNav button:active/);
  assert.match(labCss, /\.directionStage\[data-direction="pixel"\] \.directionBottomNav button:focus-visible/);
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
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
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
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
  for (const marker of ["m3-missing-title", "sampleTopBar", "sampleNavigationRail", "sampleFab", "sampleBadge", "sampleMaterialField", "sampleRadioGroup", "sampleListItem", "sampleMenu", "sampleCircularProgress", "sampleSkeleton", "sampleTooltipWrap"]) {
    assert.ok(labSource.includes(marker), `Design Lab is missing ${marker}`);
  }
  for (const marker of [".sampleTopBar", ".sampleNavigationRail", ".sampleFab", ".sampleMaterialField", ".sampleRadioGroup", ".sampleListItem", ".sampleMenu", ".sampleCircularProgress", ".sampleSkeleton"]) {
    assert.ok(labCss.includes(marker), `Design Lab styles are missing ${marker}`);
  }
  assert.match(labSource, /checked=\{sampleRadio==="all"\}/);
  assert.match(labSource, /aria-expanded=\{sampleMenuOpen\}/);
});


test("Design Lab renders the shared production UI primitives against the active Material 3 scheme", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
  for (const component of ["Button", "IconButton", "Card", "Panel", "ResultPanel", "Checkbox", "TextField", "TextArea", "Select", "SegmentedControl", "ValidationMessage", "Switch"]) {
    assert.match(labSource, new RegExp(`import \\{ ${component} \\} from "@\\/components\\/ui\\/${component}"`), `missing shared component import: ${component}`);
  }
  for (const token of ["--foreground:var(--lab-text)", "--surface:var(--lab-surface)", "--surface-soft:var(--lab-surface-container)", "--secondary-container:var(--lab-secondary-container)", "--error:var(--lab-error)", "--focus-ring:var(--lab-primary)"]) {
    assert.ok(labCss.includes(token), `missing scoped token bridge: ${token}`);
  }
  assert.match(labSource, /aria-labelledby="shared-components-title"/);
});


test("Design Lab does not reference missing CSS module classes", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
  const references = [...new Set([...labSource.matchAll(/styles\.([A-Za-z_]\w*)/g)].map((match) => match[1]))];
  for (const className of references) {
    assert.match(labCss, new RegExp(`\\.${className}(?![\\w-])`), `missing CSS module class: ${className}`);
  }
});


test("Section 03 dialog preview trigger uses the shared Material 3 outlined button", () => {
  const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
  const labCss = readFileSync(new URL("../../app/[locale]/design-lab/visual-lab.module.css", import.meta.url), "utf8");
  assert.match(labSource, /aria-labelledby="states-title"[\s\S]*?<Button type="button" variant="outlined" className=\{styles\.dialogPreviewTrigger\} onClick=\{\(\)=>setDialogOpen\(true\)\}>\{t\.confirm\} · dialog<\/Button>/);
  assert.match(labCss, /\.dialogPreviewTrigger\{flex-shrink:0;white-space:nowrap\}/);
});
