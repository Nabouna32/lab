import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
const alertDialogSource = readFileSync(new URL("../../components/ui/AlertDialog.tsx", import.meta.url), "utf8");
const alertDialogCss = readFileSync(new URL("../../components/ui/AlertDialog.module.css", import.meta.url), "utf8");
const checkboxSource = readFileSync(new URL("../../components/ui/Checkbox.tsx", import.meta.url), "utf8");
const switchSource = readFileSync(new URL("../../components/ui/Switch.tsx", import.meta.url), "utf8");
const iconSource = readFileSync(new URL("../../components/ui/MaterialIcon.tsx", import.meta.url), "utf8");
const progressSource = readFileSync(new URL("../../components/ui/ProgressIndicator.tsx", import.meta.url), "utf8");
const progressCss = readFileSync(new URL("../../components/ui/progress-indicator.module.css", import.meta.url), "utf8");
const textFieldSource = readFileSync(new URL("../../components/ui/TextField.tsx", import.meta.url), "utf8");
const visualLabSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const textAreaSource = readFileSync(new URL("../../components/ui/TextArea.tsx", import.meta.url), "utf8");
const calculatorFieldSource = readFileSync(new URL("../../components/tools/calculator/CalculatorField.tsx", import.meta.url), "utf8");
const selectSource = readFileSync(new URL("../../components/ui/Select.tsx", import.meta.url), "utf8");
const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonVariantStylesSource = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");
const iconButtonSource = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const headerMenuSource = readFileSync(new URL("../../components/layout/DesktopHeaderMenu.tsx", import.meta.url), "utf8");
const messagesSource = readFileSync(new URL("../i18n/messages.ts", import.meta.url), "utf8");
const typographyComponentStyles = {
  bottomSheetScaffold: readFileSync(new URL("../../components/ui/BottomSheetScaffold.module.css", import.meta.url), "utf8"),
  buttonGroup: readFileSync(new URL("../../components/ui/ButtonGroup.module.css", import.meta.url), "utf8"),
  datePicker: readFileSync(new URL("../../components/ui/DatePicker.module.css", import.meta.url), "utf8"),
  floatingActionButton: readFileSync(new URL("../../components/ui/FloatingActionButton.module.css", import.meta.url), "utf8"),
  floatingActionButtonMenu: readFileSync(new URL("../../components/ui/FloatingActionButtonMenu.module.css", import.meta.url), "utf8"),
  floatingToolbar: readFileSync(new URL("../../components/ui/FloatingToolbar.module.css", import.meta.url), "utf8"),
  modalBottomSheet: readFileSync(new URL("../../components/ui/ModalBottomSheet.module.css", import.meta.url), "utf8"),
  pullToRefresh: readFileSync(new URL("../../components/ui/PullToRefreshBox.module.css", import.meta.url), "utf8"),
  rangeSlider: readFileSync(new URL("../../components/ui/RangeSlider.module.css", import.meta.url), "utf8"),
  segmentedButtonGroup: readFileSync(new URL("../../components/ui/SegmentedButtonGroup.module.css", import.meta.url), "utf8"),
  splitButton: readFileSync(new URL("../../components/ui/SplitButton.module.css", import.meta.url), "utf8"),
  swipeToDismiss: readFileSync(new URL("../../components/ui/SwipeToDismissBox.module.css", import.meta.url), "utf8"),
  wideNavigationRail: readFileSync(new URL("../../components/ui/WideNavigationRail.module.css", import.meta.url), "utf8"),
  slider: readFileSync(new URL("../../components/ui/slider.module.css", import.meta.url), "utf8"),
  alertDialog: readFileSync(new URL("../../components/ui/AlertDialog.module.css", import.meta.url), "utf8"),
  datePickerDialog: readFileSync(new URL("../../components/ui/DatePickerDialog.module.css", import.meta.url), "utf8"),
  dropdownMenu: readFileSync(new URL("../../components/ui/DropdownMenu.module.css", import.meta.url), "utf8"),
  exposedDropdownMenu: readFileSync(new URL("../../components/ui/ExposedDropdownMenu.module.css", import.meta.url), "utf8"),
  navigationBar: readFileSync(new URL("../../components/ui/NavigationBar.module.css", import.meta.url), "utf8"),
  navigationDrawer: readFileSync(new URL("../../components/ui/NavigationDrawer.module.css", import.meta.url), "utf8"),
  navigationRail: readFileSync(new URL("../../components/ui/NavigationRail.module.css", import.meta.url), "utf8"),
  radioButton: readFileSync(new URL("../../components/ui/RadioButton.module.css", import.meta.url), "utf8"),
  snackbar: readFileSync(new URL("../../components/ui/Snackbar.module.css", import.meta.url), "utf8"),
  tabs: readFileSync(new URL("../../components/ui/Tabs.module.css", import.meta.url), "utf8"),
  timePicker: readFileSync(new URL("../../components/ui/TimePicker.module.css", import.meta.url), "utf8"),
  toggleButton: readFileSync(new URL("../../components/ui/ToggleButton.module.css", import.meta.url), "utf8"),
  tooltip: readFileSync(new URL("../../components/ui/Tooltip.module.css", import.meta.url), "utf8"),
  topAppBar: readFileSync(new URL("../../components/ui/TopAppBar.module.css", import.meta.url), "utf8"),
};
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
test("shared typography roles drive component CSS instead of duplicated font metrics", () => {
  const expectations = [
    ["alertDialog", "--m3-type-headline-small-size", "--m3-type-body-medium-size"],
    ["datePickerDialog", "--m3-type-headline-small-size"],
    ["dropdownMenu", "--m3-type-label-large-size", "--m3-type-body-medium-size", "--m3-type-body-small-size"],
    ["exposedDropdownMenu", "--m3-type-body-medium-size", "--m3-type-body-small-size"],
    ["navigationBar", "--m3-type-label-medium-size"],
    ["navigationDrawer", "--m3-type-title-large-size", "--m3-type-title-small-size", "--m3-type-label-large-size"],
    ["navigationRail", "--m3-type-label-medium-size", "--m3-type-label-small-size"],
    ["radioButton", "--m3-type-body-medium-size"],
    ["snackbar", "--m3-type-body-medium-size"],
    ["tabs", "--m3-type-label-large-size"],
    ["timePicker", "--m3-type-body-medium-size", "--m3-type-body-small-size"],
    ["toggleButton", "--m3-type-label-large-size"],
    ["tooltip", "--m3-type-body-small-size", "--m3-type-body-medium-size", "--m3-type-title-small-size"],
    ["topAppBar", "--m3-type-title-large-size", "--m3-type-headline-small-size", "--m3-type-headline-medium-size"],
    
    ["bottomSheetScaffold", "--m3-type-label-large-size"],
    ["buttonGroup", "--m3-type-label-large-size"],
    ["datePicker", "--m3-type-label-medium-size", "--m3-type-label-large-size", "--m3-type-body-small-size", "--m3-type-title-small-size", "--m3-type-body-medium-size"],
    ["floatingActionButton", "--m3-type-label-large-size"],
    ["floatingActionButtonMenu", "--m3-type-label-large-size"],
    ["floatingToolbar", "--m3-type-label-large-size"],
    ["modalBottomSheet", "--m3-type-title-large-size", "--m3-type-body-medium-size"],
    ["pullToRefresh", "--m3-type-body-medium-size"],
    ["rangeSlider", "--m3-type-label-large-size", "--m3-type-body-medium-size"],
    ["segmentedButtonGroup", "--m3-type-label-large-size"],
    ["splitButton", "--m3-type-label-large-size"],
    ["swipeToDismiss", "--m3-type-label-large-size"],
    ["wideNavigationRail", "--m3-type-label-large-size"],
    ["slider", "--m3-type-body-medium-size", "--m3-type-label-large-size", "--m3-type-body-small-size"],
  ];

  for (const [component, ...tokens] of expectations) {
    for (const token of tokens) {
      assert.ok(typographyComponentStyles[component].includes(token), `${component} must consume ${token}`);
    }
  }

  assert.match(typographyComponentStyles.topAppBar, /\.medium\.expanded \.title \{[^}]*--m3-type-headline-small-size/s);
  assert.match(typographyComponentStyles.topAppBar, /\.large\.expanded \.title \{[^}]*--m3-type-headline-medium-size/s);
  assert.match(typographyComponentStyles.topAppBar, /\.medium:not\(\.expanded\) \.title, \.large:not\(\.expanded\) \.title \{[^}]*--m3-type-title-large-size/s);
  assert.doesNotMatch(typographyComponentStyles.topAppBar, /\.medium\.expanded \.title \{[^}]*--m3-type-headline-medium-size/s);
});

test("shared production compositions consume named typography and shape roles", () => {
  const appLink = readFileSync(new URL("../../components/ui/AppLink.tsx", import.meta.url), "utf8");
  const resultPanel = readFileSync(new URL("../../components/ui/ResultPanel.tsx", import.meta.url), "utf8");
  const recentTools = readFileSync(new URL("../../components/home/RecentTools.tsx", import.meta.url), "utf8");
  const relatedTools = readFileSync(new URL("../../components/tools/RelatedTools.tsx", import.meta.url), "utf8");
  const toolCard = readFileSync(new URL("../../components/tools/ToolCard.tsx", import.meta.url), "utf8");
  const validationMessage = readFileSync(new URL("../../components/ui/ValidationMessage.tsx", import.meta.url), "utf8");

  assert.match(appLink, /m3-type-label-large/);
  assert.match(resultPanel, /m3-type-label-medium/);
  assert.match(resultPanel, /m3-type-body-medium/);
  assert.match(resultPanel, /m3-type-display-small/);
  assert.match(resultPanel, /--m3-type-display-medium-size/);
  assert.match(recentTools, /m3-type-title-medium/);
  assert.match(recentTools, /m3-type-body-medium/);
  assert.match(recentTools, /m3-type-label-large/);
  assert.match(recentTools, /--m3-card-shape/);
  assert.match(relatedTools, /m3-type-title-large/);
  assert.match(relatedTools, /m3-type-title-medium/);
  assert.match(relatedTools, /m3-type-body-medium/);
  assert.match(relatedTools, /shape-corner-medium/);
  assert.match(toolCard, /shape-corner-medium/);
  assert.match(validationMessage, /m3-type-body-medium/);
});

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

test("indeterminate linear progress follows pinned AndroidX segment timing and reduced-motion fallback", () => {
  assert.match(progressSource, /data-segment="first"/);
  assert.match(progressSource, /data-segment="second"/);
  assert.match(progressSource, /normalizedValue === undefined \? \{\} : \{ "aria-valuenow": normalizedValue \}/);
  assert.match(progressCss, /loculary-progress-first-head 1750ms infinite/);
  assert.match(progressCss, /loculary-progress-first-tail 1750ms infinite/);
  assert.match(progressCss, /loculary-progress-second-head 1750ms infinite/);
  assert.match(progressCss, /loculary-progress-second-tail 1750ms infinite/);
  assert.match(progressCss, /cubic-bezier\(0\.3, 0, 0\.8, 0\.15\)/);
  for (const keyframe of ["14.285714%", "37.142857%", "51.428571%", "57.142857%", "71.428571%", "85.714286%"]) {
    assert.ok(progressCss.includes(keyframe), `missing AndroidX timing boundary ${keyframe}`);
  }
  assert.match(progressCss, /inset-inline-start/);
  assert.match(progressCss, /inset-inline-end/);
  assert.match(progressCss, /repeating-linear-gradient/);
  assert.match(progressCss, /prefers-reduced-motion: reduce/);
});

test("functional icons use bundled Material Symbols paths and inherit currentColor", () => {
  for (const name of ["content_copy", "delete", "restart_alt", "arrow_outward", "lock", "public", "cloud", "warning", "star_fill", "collections_bookmark", "keyboard_arrow_down", "swap_horiz", "apps", "language"]) {
    assert.ok(iconSource.includes(name), `missing Material Symbol: ${name}`);
  }
  assert.match(iconSource, /fill="currentColor"/);
  assert.match(iconSource, /viewBox="0 -960 960 960"/);
});

test("breadcrumbs and collapsible tool sections use Material Symbols instead of text glyphs", () => {
  const breadcrumbsSource = readFileSync(new URL("../../components/layout/Breadcrumbs.tsx", import.meta.url), "utf8");
  const sectionSource = readFileSync(new URL("../../components/tools/ToolPage/ToolSection.tsx", import.meta.url), "utf8");
  const languageSource = readFileSync(new URL("../../components/layout/LanguageFlag.tsx", import.meta.url), "utf8");
  const converterSource = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
  assert.match(breadcrumbsSource, /MaterialIcon name="chevron_right"/);
  assert.doesNotMatch(breadcrumbsSource, /›/);
  assert.match(sectionSource, /MaterialIcon name="keyboard_arrow_down"/);
  assert.doesNotMatch(sectionSource, /aria-hidden="true">\+/);
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
  assert.match(headerSource, /m3-type-label-large block text-\[var\(--foreground\)\]/);
  assert.doesNotMatch(headerSource, /function Icon\(/);
});

test("standard functional UI surfaces do not reintroduce one-off inline SVG icons", () => {
  const sharedFunctionalIconCallSites = [
    "../../app/[locale]/compte/page.tsx",
    "../../app/[locale]/design-lab/VisualLab.tsx",
    "../../components/layout/DesktopHeaderMenu.tsx",
    "../../components/layout/LanguageFlag.tsx",
    "../../components/layout/HeaderSearch.tsx",
    "../../components/tools/ToolSearch.tsx",
    "../../components/tools/number-base-converter/NumberBaseConverter.tsx",
  ];

  for (const relativePath of sharedFunctionalIconCallSites) {
    const source = readFileSync(new URL(relativePath, import.meta.url), "utf8");
    assert.doesNotMatch(source, /<svg\b/, `${relativePath} should use the shared MaterialIcon component for standard UI icons`);
  }
});

test("shared action controls use semantic state-layer colors instead of brightness filters", () => {
  const buttonSource = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
  const iconButtonSource = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
  const favoriteSource = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
  const appLinkSource = readFileSync(new URL("../../components/ui/AppLink.tsx", import.meta.url), "utf8");
  const buttonVariantStylesSource = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");
  const collectionsSource = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");

  for (const [name, source] of [
    ["Button", buttonSource],
    ["IconButton", iconButtonSource],
    ["FavoriteButton", favoriteSource],
    ["AppLink", appLinkSource],
    ["shared Button variant styles", buttonVariantStylesSource],
    ["CollectionsView", collectionsSource],
  ]) {
    assert.doesNotMatch(source, /hover:brightness|filter:brightness|transition-\[[^\]]*filter/ , `${name} should not dim foreground content through a whole-element brightness filter`);
  }

  assert.ok(buttonVariantStylesSource.includes("var(--button-container-color,var(--primary))_92%,var(--button-content-color,var(--on-primary))"));
  assert.ok(buttonVariantStylesSource.includes("var(--button-container-color,var(--secondary-container))_92%,var(--button-content-color,var(--on-secondary-container))"));
  assert.match(appLinkSource, /import NextLink, \{ type LinkProps \} from "next\/link"/);
  assert.match(appLinkSource, /materialButtonVariantStyles\[variant\]/);
  assert.match(appLinkSource, /import type \{ ButtonColors \} from "@\/components\/ui\/Button"/);
  assert.match(appLinkSource, /getMaterialButtonInlineStyle\(isMaterialButton/);
  assert.match(buttonVariantStylesSource, /colors\?\.contentColor/);
  assert.match(appLinkSource, /variant === "filled".*variant === "text"/s);
  assert.ok(iconButtonSource.includes("var(--icon-button-container-color,var(--primary))_92%,var(--icon-button-content-color,var(--on-primary))"));
  assert.ok(favoriteSource.includes("const FavoriteActionButton = active ? FilledTonalButton : OutlinedButton;"));
  assert.match(favoriteSource, /import \{ IconToggleButton \} from "@\/components\/ui\/IconButton"/);
  assert.match(appLinkSource, /materialButtonVariantStyles/);
  assert.match(collectionsSource, /<Button type="submit" disabled=/);
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


test("segmented control keeps labels single-line and leaves descriptions outside the M3 control", () => {
  const segmentedSource = readFileSync(new URL("../../components/ui/SegmentedControl.tsx", import.meta.url), "utf8");
  const percentageSource = readFileSync(new URL("../../components/tools/percentage/PercentageCalculator.tsx", import.meta.url), "utf8");
  const videoBitrateSource = readFileSync(new URL("../../components/tools/video-bitrate/VideoBitrateCalculator.tsx", import.meta.url), "utf8");
  assert.match(segmentedSource, /whitespace-nowrap/);
  assert.match(segmentedSource, /m3-type-label-large/);
  assert.match(segmentedSource, /text-\[length:var\(--m3-type-label-large-size\)\]|leading-\[var\(--m3-type-label-large-line-height\)\]/);
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

test("AndroidX-named Buttons support per-state color customization without product-specific variants", () => {
  for (const component of ["Button", "ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton"]) {
    assert.ok(buttonSource.includes("export function " + component + "("), "missing official component export: " + component);
  }
  assert.ok(buttonVariantStylesSource.includes("--button-disabled-container-color"));
  assert.ok(buttonVariantStylesSource.includes("--button-disabled-content-color"));
  assert.ok(buttonVariantStylesSource.includes("disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)]"));
  assert.ok(buttonVariantStylesSource.includes("disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))]"));
  assert.ok(buttonVariantStylesSource.includes("disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))]"));
  assert.ok(buttonVariantStylesSource.includes("color-mix(in_srgb,var(--on-surface)_38%,transparent)"));
  assert.ok(buttonSource.includes("export type ButtonColors ="));
  assert.ok(buttonSource.includes("enabled?: boolean"));
  assert.ok(buttonSource.includes("disabled={disabled ?? !enabled}"));
  assert.ok(buttonVariantStylesSource.includes('"--button-container-color": colors.containerColor'));
  assert.ok(buttonVariantStylesSource.includes('"--button-disabled-container-color": colors.disabledContainerColor'));
  assert.ok(!buttonSource.includes("DestructiveButton"), "destructive styling uses color customization, not a custom component");
  assert.doesNotMatch(buttonSource, /primary: filled|secondary: outlined|tonal: filledTonal|ghost: text/);
  assert.ok(iconButtonSource.includes("group-disabled:bg-[var(--icon-button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))]"));
  assert.ok(iconButtonSource.includes("group-disabled:border-[color-mix(in_srgb,var(--outline-variant)_38%,transparent)]"));
  assert.ok(iconButtonSource.includes("const toggleUncheckedStyles: Record<IconButtonStyle, string>"));
  assert.ok(iconButtonSource.includes("const toggleCheckedStyles: Record<IconButtonStyle, string>"));
  assert.ok(iconButtonSource.includes("export type IconButtonColors ="));
  assert.ok(iconButtonSource.includes("enabled?: boolean"));
  assert.match(iconButtonSource, /aria-pressed=\{isToggle \? checked : undefined\}/, "toggle buttons expose the pressed state while retaining native button semantics");
  assert.doesNotMatch(iconButtonSource, /role=\{isToggle \? "checkbox"/, "icon toggle buttons are buttons, not checkboxes");
  assert.ok(iconButtonSource.includes("disabled={disabled ?? !enabled}"));
  assert.ok(iconButtonSource.includes("export type IconToggleButtonColors ="));
  assert.ok(iconButtonSource.includes("colors?: Partial<IconButtonColors>"));
  assert.ok(iconButtonSource.includes('shape?: CSSProperties["borderRadius"]'));
  assert.ok(iconButtonSource.includes("type OutlinedIconButtonProps = IconButtonProps &"));
  assert.ok(iconButtonSource.includes("type OutlinedIconToggleButtonProps = IconToggleButtonProps &"));
  assert.ok(iconButtonSource.includes('"filled-tonal": "border border-transparent bg-[var(--icon-button-checked-container-color,var(--secondary))] text-[var(--icon-button-checked-content-color,var(--on-secondary))]'));
  assert.ok(iconButtonSource.includes('outlined: "border border-transparent bg-[var(--icon-button-checked-container-color,var(--inverse-surface))] text-[var(--icon-button-checked-content-color,var(--inverse-on-surface))]'));
  assert.ok(iconButtonSource.includes("group-hover:bg-[color-mix(in_srgb,var(--icon-button-checked-container-color,var(--inverse-surface))_92%,var(--icon-button-checked-content-color,var(--inverse-on-surface)))]"));
  assert.ok(iconButtonSource.includes("group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-container))_92%,var(--icon-button-content-color,var(--on-surface-variant)))]"));
  assert.ok(iconButtonSource.includes("group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_90%,var(--on-surface-variant))]"));
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

test("TextField labels reflect invalid state while disabled labels keep disabled color", () => {
  assert.match(textFieldSource, /const isInvalid = !disabled && Boolean\(inputProps\["aria-invalid"\]\);/);
  assert.match(textFieldSource, /isInvalid \? "text-\[var\(--danger\)\]" : "text-\[var\(--foreground\)\]"/);
  assert.match(textFieldSource, /disabled \? "text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]" : isInvalid \? "text-\[var\(--danger\)\] peer-aria-\[invalid=true\]:text-\[var\(--danger\)\]"/);
});

test("Design Lab exposes the production MaterialTextField validation without requiring an account", () => {
  assert.ok(visualLabSource.includes('import { MaterialTextField } from "@/components/ui/MaterialTextField"'));
  assert.ok(visualLabSource.includes('<MaterialTextField'));
  assert.ok(visualLabSource.includes('id="lab-material-password"'));
  assert.ok(visualLabSource.includes('autoComplete="new-password"'));
  assert.ok(visualLabSource.includes('error={passwordTooShort ? passwordRule : undefined}'));
  assert.ok(visualLabSource.includes('supportingText={passwordTooShort ? undefined : passwordRule}'));
});

test("TextField and TextArea keep their explicit inputId bound to the visible label", () => {
  assert.match(textFieldSource, /Omit<InputHTMLAttributes<HTMLInputElement>, "id">/);
  assert.equal((textFieldSource.match(/\{\.\.\.inputProps\}\s+id=\{inputId\}/g) ?? []).length, 2);
  assert.match(textAreaSource, /Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">/);
  assert.match(textAreaSource, /\{\.\.\.textareaProps\}\s+id=\{inputId\}/);
  assert.match(calculatorFieldSource, /Omit<InputHTMLAttributes<HTMLInputElement>, "id">/);
});

test("TextArea and Select labels reflect invalid state while preserving disabled colors", () => {
  assert.match(textAreaSource, /const isInvalid = Boolean\(error\) \|\| Boolean\(consumerInvalid\);/);
  assert.match(textAreaSource, /disabled \? "text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]" : isInvalid \? "text-\[var\(--error\)\]"/);
  assert.match(selectSource, /const isInvalid = Boolean\(props\["aria-invalid"\]\);/);
  assert.match(selectSource, /disabled \? "text-\[color-mix\(in_srgb,var\(--on-surface\)_38%,transparent\)\]" : isInvalid \? "text-\[var\(--danger\)\]"/);
});

test("TextArea preserves caller descriptions and adds its helper or error description", () => {
  assert.match(textAreaSource, /"aria-describedby": consumerDescribedBy/);
  assert.match(textAreaSource, /"aria-invalid": consumerInvalid/);
  assert.match(textAreaSource, /consumerDescribedBy, error \? errorId : helperText \? helperId : undefined/);
  assert.ok(textAreaSource.includes("value?.split(/\\s+/)"));
  assert.match(textAreaSource, /aria-invalid=\{error \? true : consumerInvalid\}/);
  assert.match(textAreaSource, /aria-describedby=\{describedBy\}/);
  assert.match(textAreaSource, /\{\.\.\.textareaProps\}\s+id=\{inputId\}/);
});

test("M3 web reference tokens document Android dp/sp magnitude without claiming physical equivalence", () => {
  assert.match(globalCss, /--m3-ref-unit: 0\.0625rem/);
  assert.match(globalCss, /CSS rem\/px are NOT Android dp\/sp/);
  assert.match(globalCss, /--m3-size-segmented-button-min-height: 2\.5rem/);
  assert.match(globalCss, /--m3-size-snackbar-max-width: 37\.5rem/);
  assert.match(globalCss, /--m3-size-multiline-text-field-min-height: 8rem; \/\* Loculary Web specimen sizing/);
  assert.match(globalCss, /--m3-type-label-large-size: 0\.875rem/);
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
  assert.match(headerMenuSource, /<fieldset className="min-w-0 px-2 pb-1 pt-1">/);
  assert.match(headerMenuSource, /<legend className="m3-type-label-small/);
  assert.match(headerMenuSource, /type="radio"/);
  assert.match(headerMenuSource, /name="loculary-theme"/);
  assert.match(headerMenuSource, /checked=\{selected\}/);
  assert.match(headerMenuSource, /onChange=\{\(\) => selectTheme\(option\.value\)\}/);
  assert.match(headerMenuSource, /peer-focus-visible:ring-2/);
  assert.doesNotMatch(headerMenuSource, /aria-pressed=/);
  assert.match(headerMenuSource, /const selected = themeReady && theme === option\.value/);
});


test("destructive account and collection actions preserve link/button semantics and use shared Material 3 controls", () => {
  const accountPage = readFileSync(new URL("../../app/[locale]/compte/page.tsx", import.meta.url), "utf8");
  const deleteAccountPage = readFileSync(new URL("../../app/[locale]/compte/suppression/page.tsx", import.meta.url), "utf8");
  const collectionsView = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
  assert.match(accountPage, /<Column verticalArrangement=\{Arrangement\.spacedBy\("var\(--space-4\)"\)\}[\s\S]*?<AppLink[\s\S]*?leadingIcon[\s\S]*?colors=\{\{ contentColor: "var\(--error\)" \}\}[\s\S]*?variant="text"[\s\S]*?<MaterialIcon name="delete"/);
  assert.match(accountPage, /<AppLink href=\{`\/\$\{locale\}\/compte\/connexion`\} variant="filled">/);
  assert.match(accountPage, /<AppLink href=\{`\/\$\{locale\}\/compte\/inscription`\} variant="outlined">/);
  assert.match(deleteAccountPage, /<MaterialIcon name="delete"/);
  assert.match(collectionsView, /<AlertDialog[\s\S]*?destructive[\s\S]*?onConfirm=\{confirmDeleteCollection\}/);
  assert.match(collectionsView, /<TextButton type="button" colors=\{\{ contentColor: "var\(--error\)" \}\}[\s\S]*?<MaterialIcon name="delete"/);
  assert.doesNotMatch(collectionsView, /window\.confirm/);
  assert.match(iconSource, /delete: "M261-120q-24\.75/);
});

test("AlertDialog actions use shared Material 3 buttons instead of a parallel button implementation", () => {
  assert.match(alertDialogSource, /import \{ Button, TextButton \} from "\.\/Button"/);
  assert.match(alertDialogSource, /<TextButton ref=\{dismissRef\} type="button"/);
  assert.match(alertDialogSource, /<Button type="button" colors=\{destructive \?/);
  assert.doesNotMatch(alertDialogCss, /\.dismiss, \.confirm, \.destructive/);
});


test("tool compositions use shared shape roles instead of migrated legacy aliases", () => {
  const mediumConsumers = [
    "../../components/tools/csv-diff-checker/CsvDiffChecker.tsx",
    "../../components/tools/ip-subnet-calculator/IpSubnetCalculator.tsx",
    "../../components/tools/contrast-checker/ContrastChecker.tsx",
    "../../components/tools/qr-code-generator/QrCodeGenerator.tsx",
    "../../components/tools/image-compressor/ImageCompressor.tsx",
    "../../components/tools/color-palette-generator/ColorPaletteGenerator.tsx",
    "../../components/tools/html-entity-encoder/HtmlEntityEncoder.tsx",
    "../../components/tools/ToolSearch.tsx",
    "../../components/tools/text-case-converter/TextCaseConverter.tsx",
    "../../components/tools/markdown-table-generator/MarkdownTableGenerator.tsx",
    "../../components/tools/image-metadata/ImageMetadataViewer.tsx",
    "../../components/tools/image-to-pdf/ImageToPdf.tsx",
    "../../components/tools/json-to-typescript/JsonToTypeScript.tsx",
    "../../components/tools/text-diff-checker/TextDiffChecker.tsx",
    "../../components/tools/ipv6-subnet-calculator/Ipv6SubnetCalculator.tsx",
    "../../components/tools/json-formatter/JsonFormatter.tsx",
    "../../components/tools/password-generator/PasswordGenerator.tsx",
    "../../components/tools/timezone-converter/TimezoneConverter.tsx",
    "../../components/tools/image-contact-sheet/ImageContactSheet.tsx",
  ];
  const largeConsumers = [
    "../../components/layout/Header.tsx",
    "../../components/tools/ToolPage/ToolProcessingStatus.tsx",
    "../../components/tools/text-counter/TextCounter.tsx",
    "../../components/tools/html-previewer/HtmlPreviewer.tsx",
    "../../components/tools/base64/Base64Encoder.tsx",
    "../../components/tools/url-encoder/UrlEncoder.tsx",
    "../../components/tools/regex-tester/RegexTester.tsx",
    "../../components/favorites/FavoritesView.tsx",
    "../../components/tools/ToolPage/ToolPageHeader.tsx",
  ];
  const extraLargeConsumers = [
    "../../components/tools/uuid/UuidGenerator.tsx",
    "../../components/tools/unix-timestamp/UnixTimestampConverter.tsx",
    "../../components/tools/timezone-converter/TimezoneConverter.tsx",
  ];

  for (const path of mediumConsumers) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /shape-corner-medium/, path);
    assert.doesNotMatch(source, /radius-md/, path);
  }
  for (const path of largeConsumers) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /shape-corner-large/, path);
    assert.doesNotMatch(source, /radius-lg/, path);
  }
  for (const path of extraLargeConsumers) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(source, /shape-corner-extra-large/, path);
    assert.doesNotMatch(source, /radius-2xl/, path);
  }
});

test("tool section headings and descriptions consume shared Material 3 typography roles", () => {
  const toolSection = readFileSync(new URL("../../components/tools/ToolPage/ToolSection.tsx", import.meta.url), "utf8");
  assert.match(toolSection, /m3-type-title-medium/);
  assert.match(toolSection, /m3-type-body-medium/);
  assert.doesNotMatch(toolSection, /text-base font-bold tracking-tight|text-sm leading-6/);
});


test("ListItem follows AndroidX baseline metrics and safely wraps long content", () => {
  const listItem = readFileSync(new URL("../../components/ui/ListItem.tsx", import.meta.url), "utf8");
  const listItemCss = readFileSync(new URL("../../components/ui/ListItem.module.css", import.meta.url), "utf8");
  const spec = readFileSync(new URL("../../../docs/material3/components/ListItem.md", import.meta.url), "utf8");

  assert.match(listItem, /lines = overline && supporting \? 3 : supporting \|\| overline \? 2 : 1/);
  assert.match(listItemCss, /\.lines-1\{min-height:56px\}/);
  assert.match(listItemCss, /\.lines-2\{min-height:72px\}/);
  assert.match(listItemCss, /\.lines-3\{min-height:88px;padding-block:12px\}/);
  assert.match(listItemCss, /min-width:0/);
  assert.match(listItemCss, /overflow-wrap:anywhere/);
  assert.match(listItemCss, /m3-type-body-large-size/);
  assert.match(listItemCss, /m3-type-body-medium-size/);
  assert.match(spec, /AndroidX Material 3 \*\*1\.4\.0\*\*/);
  assert.match(spec, /hauteurs ci-dessus sont des minima/);
});

test("account overview exposes localized account destinations without revealing the email value", () => {
  const accountPage = readFileSync(new URL("../../app/[locale]/compte/page.tsx", import.meta.url), "utf8");

  assert.match(accountPage, /href=\{\`\/\$\{locale\}\/compte\/email\`\}/);
  assert.match(accountPage, /href=\{\`\/\$\{locale\}\/compte\/mot-de-passe\`\}/);
  assert.doesNotMatch(accountPage, /\{user\.email\}/);
});


test("account overview keeps its personal destinations available in both locales", () => {
  const accountPage = readFileSync(new URL("../../app/[locale]/compte/page.tsx", import.meta.url), "utf8");

  for (const destination of ["informations-personnelles", "email", "mot-de-passe"]) {
    assert.ok(accountPage.includes(destination), `missing account destination: ${destination}`);
  }
  assert.match(messagesSource, /title: "Votre compte"/);
  assert.match(messagesSource, /title: "Your account"/);
});

test("personal information page owns profile editing and localized feedback", () => {
  const profilePage = readFileSync(new URL("../../app/[locale]/compte/informations-personnelles/page.tsx", import.meta.url), "utf8");
  const actions = readFileSync(new URL("../../app/[locale]/compte/actions.ts", import.meta.url), "utf8");

  assert.match(profilePage, /action=\{updateProfile\}/);
  assert.match(profilePage, /name="displayName"/);
  assert.match(profilePage, /name="preferredLocale"/);
  assert.match(profilePage, /query\.status === "profile-updated"/);
  assert.match(actions, /\/compte\/informations-personnelles\?error=profile/);
  assert.match(actions, /\/compte\/informations-personnelles\?status=profile-updated/);
});


test("application navigation preserves accessible links and localized destinations without prescribing a layout", () => {
  const navigation = readFileSync(new URL("../../components/layout/AdaptiveAppNavigation.tsx", import.meta.url), "utf8");
  const navigationCss = readFileSync(new URL("../../components/layout/AdaptiveAppNavigation.module.css", import.meta.url), "utf8");

  assert.match(navigation, /<nav\b/);
  assert.match(navigation, /<Link[\s\S]*?aria-current=\{selected \? "page" : undefined\}/);
  assert.match(navigation, /getToolsPath\(locale\)/);
  assert.match(navigation, /getGuidedWorkflowsPath\(locale\)/);
  assert.match(navigation, /\$\{locale\}\/compte/);
  assert.match(navigationCss, /:focus-visible/);
  assert.match(navigationCss, /prefers-reduced-motion: reduce/);
});

test("remaining public, admin and account pages consume shared Material 3 typography roles", () => {
  const informationPage = readFileSync(new URL("../../components/information/InformationPage.tsx", import.meta.url), "utf8");
  const adminPage = readFileSync(new URL("../../app/[locale]/admin/page.tsx", import.meta.url), "utf8");
  const auditPage = readFileSync(new URL("../../app/[locale]/admin/audit/page.tsx", import.meta.url), "utf8");
  const changeEmailPage = readFileSync(new URL("../../app/[locale]/compte/email/page.tsx", import.meta.url), "utf8");
  const footer = readFileSync(new URL("../../components/layout/Footer.tsx", import.meta.url), "utf8");
  const signInPage = readFileSync(new URL("../../app/[locale]/compte/connexion/page.tsx", import.meta.url), "utf8");
  const signUpPage = readFileSync(new URL("../../app/[locale]/compte/inscription/page.tsx", import.meta.url), "utf8");
  const passwordPage = readFileSync(new URL("../../app/[locale]/compte/mot-de-passe/page.tsx", import.meta.url), "utf8");
  const deleteAccountPage = readFileSync(new URL("../../app/[locale]/compte/suppression/page.tsx", import.meta.url), "utf8");
  const adminUsersPage = readFileSync(new URL("../../app/[locale]/admin/utilisateurs/page.tsx", import.meta.url), "utf8");
  const accountPage = readFileSync(new URL("../../app/[locale]/compte/page.tsx", import.meta.url), "utf8");
  const personalInformationPage = readFileSync(new URL("../../app/[locale]/compte/informations-personnelles/page.tsx", import.meta.url), "utf8");

  for (const [name, source] of [
    ["information page", informationPage],
    ["admin dashboard", adminPage],
    ["admin audit", auditPage],
    ["change email", changeEmailPage],
    ["footer", footer],
    ["sign-in page", signInPage],
    ["sign-up page", signUpPage],
    ["password page", passwordPage],
    ["account deletion page", deleteAccountPage],
    ["admin users page", adminUsersPage],
    ["account overview", accountPage],
    ["personal information page", personalInformationPage],
  ]) {
    assert.match(source, /m3-type-(?:headline|title|body|label)-/i, `${name} must use shared Material 3 typography roles`);
  }

  assert.ok(informationPage.includes("rounded-[var(--shape-corner-extra-large)]"));
  assert.ok(informationPage.includes("rounded-[var(--shape-corner-large)]"));
  assert.ok(footer.includes("m3-type-body-small"));

  for (const [name, source] of [
    ["sign-in page", signInPage],
    ["sign-up page", signUpPage],
    ["account deletion page", deleteAccountPage],
  ]) {
    assert.ok(source.includes('import { Column } from "@/components/layout/compose/Column";'), `${name} must consume the shared Compose Column primitive`);
    assert.ok(source.includes('import { Arrangement } from "@/components/layout/compose/Arrangement";'), `${name} must consume the shared Compose Arrangement primitive`);
    assert.ok(source.includes('Arrangement.spacedBy("var(--space-5)")'), `${name} must use the shared spacing token through Arrangement.spacedBy`);
    assert.ok(!/<form[^>]*space-y-/.test(source), `${name} must not keep a local Tailwind vertical-spacing utility on the migrated form`);
  }
  assert.ok(signInPage.includes('Arrangement.spacedBy("var(--space-3)")'), "confirmation-resend form must use the shared Compose spacing primitive");
  assert.ok(!/<form[^>]*space-y-/.test(signInPage), "sign-in page forms must not retain local Tailwind vertical-spacing utilities");
  assert.ok(accountPage.includes('import { Column } from "@/components/layout/compose/Column";'));
  assert.ok(!accountPage.includes("space-y-"), "account overview must not retain its migrated vertical-spacing utilities");
  assert.ok(personalInformationPage.includes('Arrangement.spacedBy("var(--space-5)")'));
  assert.ok(!/<form[^>]*space-y-/.test(personalInformationPage), "personal information form must use shared Compose spacing");
});


test("email and password settings preserve accessible, localized account operations", () => {
  const emailPage = readFileSync(new URL("../../app/[locale]/compte/email/page.tsx", import.meta.url), "utf8");
  const passwordPage = readFileSync(new URL("../../app/[locale]/compte/mot-de-passe/page.tsx", import.meta.url), "utf8");
  const passwordForm = readFileSync(new URL("../../components/account/PasswordChangeForm.tsx", import.meta.url), "utf8");

  assert.match(emailPage, /aria-label=\{t\.account\.emailAddress\}/);
  assert.match(emailPage, /role="status"/);
  assert.match(emailPage, /role="alert"/);
  assert.match(emailPage, /<TextField label=\{t\.account\.email\}[^>]*type="email"/);
  assert.match(passwordPage, /<PasswordChangeForm locale=\{locale\} t=\{t\.account\} serverError=\{query\.error\} \/>/);
  assert.match(passwordForm, /autoComplete="current-password"/);
  assert.match(passwordForm, /autoComplete="new-password"/);
  assert.match(passwordForm, /minLength=\{8\} maxLength=\{128\}/);
  assert.match(passwordForm, /role="alert"/);
  assert.match(passwordForm, /t\.passwordRuleMin/);
  assert.match(passwordForm, /t\.passwordRuleMatch/);
  assert.match(messagesSource, /changePasswordDescription: "Choisissez un nouveau mot de passe/);
  assert.match(messagesSource, /changePasswordDescription: "Choose a new password/);
});


test("Chip delegates typography metrics to the shared Material 3 label role", () => {
  const chipSource = readFileSync(new URL("../../components/ui/Chip.tsx", import.meta.url), "utf8");
  const chipStyles = readFileSync(new URL("../../components/ui/Chip.module.css", import.meta.url), "utf8");

  assert.match(chipSource, /m3-type-label-large/);
  assert.ok(!chipStyles.includes("font-size: var(--m3-type-label-large-size)"));
  assert.ok(!chipStyles.includes("line-height: var(--m3-type-label-large-line-height)"));
  assert.ok(!chipStyles.includes("font-weight: var(--m3-type-label-large-weight)"));
  assert.ok(!chipStyles.includes("letter-spacing: var(--m3-type-label-large-tracking)"));
});


test("Badge delegates typography metrics to the shared Material 3 label role", () => {
  const badgeSource = readFileSync(new URL("../../components/ui/Badge.tsx", import.meta.url), "utf8");
  const badgeStyles = readFileSync(new URL("../../components/ui/Badge.module.css", import.meta.url), "utf8");

  assert.match(badgeSource, /m3-type-label-small/);
  assert.ok(!badgeStyles.includes("font-size: var(--m3-type-label-small-size)"));
  assert.ok(!badgeStyles.includes("line-height: var(--m3-type-label-small-line-height)"));
  assert.ok(!badgeStyles.includes("font-weight: var(--m3-type-label-small-weight)"));
  assert.ok(!badgeStyles.includes("letter-spacing: var(--m3-type-label-small-tracking)"));
});


test("dropdown selection and expansion glyphs use the shared Material Symbols registry", () => {
  const dropdown = readFileSync(new URL("../../components/ui/DropdownMenu.tsx", import.meta.url), "utf8");
  const exposedDropdown = readFileSync(new URL("../../components/ui/ExposedDropdownMenu.tsx", import.meta.url), "utf8");
  const contrastChecker = readFileSync(new URL("../../components/tools/contrast-checker/ContrastChecker.tsx", import.meta.url), "utf8");

  assert.match(dropdown, /MaterialIcon name="keyboard_arrow_down"/);
  assert.match(dropdown, /MaterialIcon name="check"/);
  assert.doesNotMatch(dropdown, /[⌄✓]/u);
  assert.match(exposedDropdown, /MaterialIcon name="keyboard_arrow_down"/);
  assert.match(exposedDropdown, /MaterialIcon name="check"/);
  assert.doesNotMatch(exposedDropdown, /[✓]/u);
  assert.match(contrastChecker, /name=\{pass \? "check" : "close"\}/);
  assert.doesNotMatch(contrastChecker, /pass \? "✓" : "—"/);
});


test("shared controls use Material Symbols instead of Unicode chevrons and action glyphs", () => {
  const sources = [
    readFileSync(new URL("../../components/ui/SplitButton.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../../components/ui/ScrollField.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../../components/ui/BottomSheetScaffold.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../../components/ui/FloatingToolbar.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../../components/ui/SwipeToDismissBox.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../../components/ui/FloatingActionButtonMenu.tsx", import.meta.url), "utf8"),
  ];
  for (const source of sources) {
    assert.match(source, /MaterialIcon/);
    assert.doesNotMatch(source, /[⌄⌃×]/u);
  }
  assert.match(sources[0], /keyboard_arrow_down/);
  assert.match(sources[1], /keyboard_arrow_up/);
  assert.match(sources[1], /keyboard_arrow_down/);
  assert.match(sources[2], /keyboard_arrow_down/);
  assert.match(sources[3], /close/);
  assert.match(sources[4], /close/);
  assert.match(sources[5], /add/);
});


test("back navigation uses the shared Material Symbols icon", () => {
  const admin = readFileSync(new URL("../../app/[locale]/admin/page.tsx", import.meta.url), "utf8");
  assert.match(admin, /MaterialIcon name="arrow_back"/);
  assert.doesNotMatch(admin, /←/u);
});


test("date, navigation rail and PDF controls use shared Material Symbols", () => {
  const rail = readFileSync(new URL("../../components/ui/WideNavigationRail.tsx", import.meta.url), "utf8");
  const datePicker = readFileSync(new URL("../../components/ui/DatePicker.tsx", import.meta.url), "utf8");
  const imageToPdf = readFileSync(new URL("../../components/tools/image-to-pdf/ImageToPdf.tsx", import.meta.url), "utf8");
  assert.match(rail, /MaterialIcon name=\{expanded \? "chevron_left" : "chevron_right"\}/);
  assert.match(datePicker, /MaterialIcon name="chevron_left"/);
  assert.match(datePicker, /MaterialIcon name="chevron_right"/);
  assert.match(imageToPdf, /MaterialIcon name="picture_as_pdf"/);
  assert.match(imageToPdf, /keyboard_arrow_up/);
  assert.match(imageToPdf, /keyboard_arrow_down/);
  assert.doesNotMatch(imageToPdf, /[📄↑↓]/u);
});


test("image tool placeholders use the shared Material Symbols registry", () => {
  const contactSheet = readFileSync(new URL("../../components/tools/image-contact-sheet/ImageContactSheet.tsx", import.meta.url), "utf8");
  const imageCompressor = readFileSync(new URL("../../components/tools/image-compressor/ImageCompressor.tsx", import.meta.url), "utf8");
  assert.match(contactSheet, /MaterialIcon name="image"/);
  assert.match(imageCompressor, /MaterialIcon name="image"/);
  assert.doesNotMatch(contactSheet, /🖼/u);
  assert.doesNotMatch(imageCompressor, /🖼/u);
});

test("duration mode labels do not embed platform-dependent emoji", () => {
  const messages = readFileSync(new URL("../../lib/i18n/tool-messages.ts", import.meta.url), "utf8");
  assert.match(messages, /datesMode: "Between two dates", timesMode: "Between two times"/);
  assert.match(messages, /datesMode: "Entre deux dates", timesMode: "Entre deux horaires"/);
  assert.doesNotMatch(messages, /datesMode: "📅/u);
  assert.doesNotMatch(messages, /timesMode: "🕐/u);
});
