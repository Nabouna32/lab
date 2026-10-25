import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const buttonVariantStyles = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");
const buttonRipple = readFileSync(new URL("../../components/ui/ButtonRipple.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const labSource = readFileSync(new URL("../../app/[locale]/design-lab/VisualLab.tsx", import.meta.url), "utf8");
const auditPreview = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentLivePreview.tsx", import.meta.url), "utf8");
const favoriteButton = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const baseConverter = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
const themeToggle = readFileSync(new URL("../../components/theme/ThemeToggle.tsx", import.meta.url), "utf8");
const languageSelector = readFileSync(new URL("../../components/layout/LanguageSelector.tsx", import.meta.url), "utf8");
const headerSearch = readFileSync(new URL("../../components/layout/HeaderSearch.tsx", import.meta.url), "utf8");
const collectionsView = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
const favoritesView = readFileSync(new URL("../../components/favorites/FavoritesView.tsx", import.meta.url), "utf8");
const toolSearch = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");
const appLink = readFileSync(new URL("../../components/ui/AppLink.tsx", import.meta.url), "utf8");
const recentTools = readFileSync(new URL("../../components/home/RecentTools.tsx", import.meta.url), "utf8");
const modalBottomSheet = readFileSync(new URL("../../components/ui/ModalBottomSheet.tsx", import.meta.url), "utf8");
const modalBottomSheetCss = readFileSync(new URL("../../components/ui/ModalBottomSheet.module.css", import.meta.url), "utf8");
const pullToRefreshBox = readFileSync(new URL("../../components/ui/PullToRefreshBox.tsx", import.meta.url), "utf8");
const pullToRefreshBoxCss = readFileSync(new URL("../../components/ui/PullToRefreshBox.module.css", import.meta.url), "utf8");

test("shared Button exports AndroidX component names with source-derived dimensions and variant-specific states", () => {
  for (const component of ["Button", "ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton"]) {
    assert.ok(button.includes("export function " + component + "("), "missing AndroidX component export: " + component);
  }
  assert.ok(button.includes("export type ButtonColors ="), "official button exports expose AndroidX-inspired color customization");
  assert.ok(button.includes("disabledContainerColor?: string") && button.includes("disabledContentColor?: string"));
  assert.ok(!button.includes("DestructiveButton"), "no Loculary-only destructive component remains");
  const buttonContract = button + buttonVariantStyles;
  for (const required of [
    "min-h-10", "min-w-[58px]", "whitespace-nowrap", "whitespace-pre-line",
    "leadingIcon?: boolean", "multiline?: boolean", "pl-3 pr-4", "pl-4 pr-6",
    "transition-[background-color,border-color,color,box-shadow]", "motion-reduce:transition-none",
    "--button-disabled-container-color",
    "--button-disabled-content-color",
    "disabled:border-[color-mix(in_srgb,var(--on-surface)_12%,transparent)]",
    "hover:shadow-[var(--button-elevation-1)]", "hover:shadow-[var(--button-elevation-2)]",
    "focus-visible:shadow-[var(--button-elevation-1)]", "<ButtonRipple />",
    'type = "button"',
  ]) assert.ok(buttonContract.includes(required), "missing Button contract: " + required);
  assert.ok(!button.includes('variant?: ButtonVariant'), "public Button API must use AndroidX-named components, not a variant prop");
  assert.ok(!button.includes("primary: filled") && !button.includes("secondary: outlined"), "Loculary legacy aliases must not remain in the public API");
  assert.ok(globalCss.includes("--button-elevation-1:") && globalCss.includes("--button-elevation-2:"));
  assert.ok(!button.includes("active:rounded-[var(--shape-corner-small)]"), "pressed state must not morph the shape in the selected Fidelity direction");
});

test("Button disabled colors follow AndroidX variant token roles", () => {
  assert.ok(buttonVariantStyles.includes("color-mix(in_srgb,var(--on-surface-variant)_38%,transparent)"), "disabled labels use the AndroidX on-surface-variant role at 38% opacity");
  assert.ok(buttonVariantStyles.includes("disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))]"), "ElevatedButton disabled container uses the AndroidX on-surface role at 10% opacity, not its enabled surface-container-low role");
  assert.ok(!buttonVariantStyles.includes("disabled:bg-[var(--button-disabled-container-color,var(--surface-container-low))]"), "ElevatedButton must not retain its enabled container as the disabled default");
});


test("button-styled links preserve anchors and share the ripple interaction", () => {
  assert.match(appLink, /import NextLink, \{ type LinkProps \} from "next\/link"/);
  assert.match(appLink, /data-material-button-link=\{isMaterialButton \? "true" : undefined\}/);
  assert.match(appLink, /isMaterialButton \? <ButtonRipple \/> : null/);
  assert.match(appLink, /materialButtonVariantStyles\[variant as MaterialButtonVariant\]/);
});

test("remaining generic text actions use shared Button variants and their obsolete local styles are removed", () => {
  assert.match(recentTools, /import \{ TextButton \} from "@\/components\/ui\/Button"/);
  assert.match(recentTools, /<TextButton type="button" onClick=\{clear\}/);
  assert.doesNotMatch(recentTools, /<button type="button" onClick=\{clear\}/);
  assert.match(modalBottomSheet, /import \{ TextButton \} from "@\/components\/ui\/Button"/);
  assert.match(modalBottomSheet, /<TextButton type="button" className="mt-2"/);
  assert.doesNotMatch(modalBottomSheet, /<button type="button" className=\{styles\.dismiss\}/);
  assert.doesNotMatch(modalBottomSheetCss, /\.dismiss\s*\{/);
  assert.match(pullToRefreshBox, /import \{ Button \} from "@\/components\/ui\/Button"/);
  assert.match(pullToRefreshBox, /<Button type="button" onClick=\{onRefresh\} disabled=\{disabled \|\| isRefreshing\}/);
  assert.doesNotMatch(pullToRefreshBox, /<button type="button" className=\{styles\.refreshAction\}/);
  assert.doesNotMatch(pullToRefreshBoxCss, /\.refreshAction/);
});

test("generic reset action in CronExpression uses OutlinedButton", () => {
  const cronExpression = readFileSync(new URL("../../components/tools/cron-expression/CronExpression.tsx", import.meta.url), "utf8");
  assert.ok(cronExpression.includes('import { OutlinedButton } from "@/components/ui/Button"'));
  assert.ok(cronExpression.includes('<OutlinedButton type="button" onClick={reset}>{t.reset}</OutlinedButton>'));
  assert.ok(!cronExpression.includes('className="rounded-[var(--radius-sm)] border border-[var(--border)] px-3 py-2 text-sm font-medium'), "obsolete local reset styling must be removed");
});

test("IPv4 and IPv6 subnet reset actions use OutlinedButton", () => {
  const ipv4 = readFileSync(new URL("../../components/tools/ip-subnet-calculator/IpSubnetCalculator.tsx", import.meta.url), "utf8");
  const ipv6 = readFileSync(new URL("../../components/tools/ipv6-subnet-calculator/Ipv6SubnetCalculator.tsx", import.meta.url), "utf8");
  for (const source of [ipv4, ipv6]) {
    assert.ok(source.includes('import { OutlinedButton } from "@/components/ui/Button"'));
    assert.ok(source.includes('<OutlinedButton type="button" onClick={reset}>{t.reset}</OutlinedButton>'));
    assert.ok(!source.includes('className="inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)]'), "obsolete local reset styling must be removed");
  }
});

test("ButtonRipple avoids creating or retaining animated ripples when reduced motion is enabled", () => {
  for (const required of [
    'window.matchMedia("(prefers-reduced-motion: reduce)").matches',
    'const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")',
    'motionPreference.addEventListener("change", handleMotionPreferenceChange)',
    'motionPreference.removeEventListener("change", handleMotionPreferenceChange)',
    'activePointers.current.clear()',
    'activeKeys.current.clear()',
    'setRipples([])',
  ]) {
    assert.ok(buttonRipple.includes(required), "missing reduced-motion ripple handling: " + required);
  }
});

test("design-system audit actions use shared Button variants", () => {
  const workbench = readFileSync(new URL("../../app/[locale]/design-lab/audit/ComponentAuditWorkbench.tsx", import.meta.url), "utf8");
  assert.ok(workbench.includes('import { Button, OutlinedButton, TextButton } from "@/components/ui/Button"'));
  assert.ok(workbench.includes("<Button type=\"submit\" disabled={savingCatalogId === entry.id}>"));
  assert.ok(workbench.includes("<OutlinedButton type=\"button\" className=\"self-end\" onClick={resetFilters}>"));
  assert.ok(workbench.includes("<TextButton type=\"button\" className=\"mt-3\" onClick={resetFilters}>"));
  assert.ok(!workbench.includes('className="rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--on-primary)] disabled:opacity-60'));
});

test("generic tool and dialog actions use the shared AndroidX Button ports", () => {
  const expenseSplitter = readFileSync(new URL("../../components/tools/expense-splitter/ExpenseSplitter.tsx", import.meta.url), "utf8");
  const datePickerDialog = readFileSync(new URL("../../components/ui/DatePickerDialog.tsx", import.meta.url), "utf8");
  const timePickerDialog = readFileSync(new URL("../../components/ui/TimePickerDialog.tsx", import.meta.url), "utf8");
  const snackbar = readFileSync(new URL("../../components/ui/Snackbar.tsx", import.meta.url), "utf8");
  const datePickerCss = readFileSync(new URL("../../components/ui/DatePickerDialog.module.css", import.meta.url), "utf8");
  const snackbarCss = readFileSync(new URL("../../components/ui/Snackbar.module.css", import.meta.url), "utf8");

  assert.ok(expenseSplitter.includes('import { Button, OutlinedButton } from "@/components/ui/Button"'));
  assert.ok(!expenseSplitter.includes("buttonClass"), "legacy local action styles must be removed after migration");
  assert.ok(datePickerDialog.includes("<TextButton ref={cancelRef}"));
  assert.ok(datePickerDialog.includes("<Button type=\"button\""));
  assert.ok(timePickerDialog.includes("<TextButton ref={cancelRef}"));
  assert.ok(timePickerDialog.includes("<Button type=\"button\""));
  assert.ok(snackbar.includes("<TextButton"));
  assert.ok(!datePickerCss.includes(".textAction") && !datePickerCss.includes(".confirmAction"));
  assert.ok(!snackbarCss.includes(".action,"), "Snackbar action styles are owned by the shared Button port");
});

test("shared IconButton preserves 48px touch target and supports accessible toggle state", () => {
  const filledIconButton = iconButton.match(/const filled = "([^"]+)"/)?.[1] ?? "";
  assert.ok(!filledIconButton.includes("shadow-"), "M3 filled icon buttons should not inherit elevation");
  for (const required of [
    'type IconButtonVariant = "standard" | "filled" | "filled-tonal"',
    'const filledTonal = "border',
    '"filled-tonal": filledTonal',
    "h-12 min-h-12 w-12 min-w-12",
    "h-10 min-h-10 w-10 min-w-10",
    "group inline-flex shrink-0 items-center justify-center",
    "aria-hidden=\"true\"",
    "selected?: boolean",
    "aria-pressed={selected}",
    "var(--secondary-container)",
    "var(--on-secondary-container)",
    'standard: "text-[var(--primary)] group-hover:text-[var(--primary)]',
    "group-disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)] group-hover:bg-",
    'outlined: "border-transparent bg-[var(--inverse-surface)] text-[var(--inverse-on-surface)] group-hover:bg-',
    "disabled:text-[color-mix(in_srgb,var(--on-surface)_38%,transparent)]",
    "label: string",
    "ref?: Ref<HTMLButtonElement>",
  ]) {
    assert.ok(iconButton.includes(required), "missing IconButton conformance rule: " + required);
  }
});

test("selected filled-tonal IconButton keeps official tonal color roles", () => {
  const selectedStyles = iconButton.slice(iconButton.indexOf("const selectedStyles:"));
  const tonalStyles = selectedStyles.split("\n").filter((line) =>
    line.trim().startsWith('"filled-tonal":') || line.trim().startsWith("tonal:"),
  );

  assert.equal(tonalStyles.length, 2, "canonical and compatibility names both need selected-state coverage");
  for (const line of tonalStyles) {
    assert.ok(
      line.includes("bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"),
      "selected tonal IconButton must use secondary-container / on-secondary-container",
    );
    assert.ok(!line.includes("bg-[var(--secondary)] text-[var(--on-secondary)]"));
  }
  assert.ok(selectedStyles.includes("group-hover:bg-[color-mix(in_srgb,var(--secondary-container)_92%,var(--on-secondary-container))]"));
  assert.ok(selectedStyles.includes("group-active:bg-[color-mix(in_srgb,var(--secondary-container)_88%,var(--on-secondary-container))]"));
});

test("Button call sites use AndroidX component names and keep extensions separate", () => {
  assert.ok(!button.includes('primary: filled'));
  assert.ok(!button.includes('tonal: filledTonal'));
  assert.ok(!button.includes('secondary: outlined'));
  assert.ok(!button.includes('ghost: text'));
  assert.ok(iconButton.includes('tonal: filledTonal'), "IconButton compatibility alias is outside this Button porting lot");
  for (const component of ["ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton"]) {
    assert.ok(labSource.includes(component), "Design Lab must exercise named component: " + component);
  }
  assert.ok(labSource.includes('containerColor: "var(--error)"'), "Design Lab demonstrates semantic error colors on an official Button");
  assert.ok(!labSource.includes("DestructiveButton"));
  for (const required of ["buttonDisabled", "buttonLongLabel", "buttonLeadingIcon", "buttonTrailingArrow", "buttonNarrow", "buttonMultiline", "buttonManualBreak", "multiline={multiline}", "arrow_forward", "Disabled state"]) {
    assert.ok(auditPreview.includes(required), "Button audit preview is missing control or state coverage: " + required);
  }
  assert.ok(labSource.includes("<IconButton"));
  assert.ok(labSource.includes('variant="filled-tonal"><MaterialIcon name="search" size={24}'));
  assert.ok(toolSearch.includes('<IconButton') && toolSearch.includes('label={t.tools.clearSearch}'));
  assert.ok(readFileSync(new URL("../../components/ui/CopyButton.tsx", import.meta.url), "utf8").includes("leadingIcon"));
  assert.ok(readFileSync(new URL("../../components/ui/ClearButton.tsx", import.meta.url), "utf8").includes("leadingIcon"));
  assert.ok(!toolSearch.includes('className="min-h-10 w-10 shrink-0 rounded-full p-0"'));
  assert.ok(toolSearch.includes('<MaterialIcon name="close" size={24} />'));
  assert.ok(toolSearch.includes('<MaterialIcon name="arrow_forward" size={24} />'));
});

test("Button audit preview provides contextual verification guidance in French and English", () => {
  for (const required of [
    "buttonScenarios",
    "Référence Android Material 3",
    "Android Material 3 baseline",
    "MDUI and MUI are secondary Web comparisons only",
    "buttonLongLabel",
    "buttonLeadingIcon || buttonTrailingArrow",
    "leadingIcon={buttonLeadingIcon}",
    "buttonNarrow",
    "buttonMultiline || buttonManualBreak",
    "buttonManualBreak",
    "200 %",
    "200%",
    "Réduction des animations",
    "Reduced motion",
    "Consignes de vérification",
    "What to verify",
    "l’aperçu seul ne prouve pas la conformité",
    "preview alone does not prove conformance",
  ]) {
    assert.ok(auditPreview.includes(required), "missing contextual Button verification guidance: " + required);
  }
});

test("favorite action uses shared M3 controls and never shrinks icon touch target below 48px", () => {
  assert.ok(favoriteButton.includes('import { FilledTonalButton, OutlinedButton } from "@/components/ui/Button"'));
  assert.ok(favoriteButton.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(favoriteButton.includes('if (compact)'));
  assert.ok(favoriteButton.includes("<IconButton"));
  assert.ok(favoriteButton.includes('<StarIcon filled={active} size={24} className="h-6 w-6 shrink-0" />'));
  assert.ok(readFileSync(new URL("../../components/ui/StarIcon.tsx", import.meta.url), "utf8").includes("size = 20"));
  assert.ok(favoriteButton.includes("const FavoriteActionButton = active ? FilledTonalButton : OutlinedButton;"));
  assert.ok(favoriteButton.includes("selected={active}"));
  assert.ok(!favoriteButton.includes("min-h-10 min-w-10"));
});

test("number-base swap action uses the shared M3 IconButton with a 24px icon", () => {
  assert.ok(baseConverter.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(baseConverter.includes('<IconButton label={t.swap} title={t.swap} variant="outlined" onClick={swapBases}'));
  assert.ok(baseConverter.includes('<MaterialIcon name="swap_horiz" size={24} />'));
  assert.ok(!baseConverter.includes('<button type="button" onClick={swapBases}'));
});

test("icon-only theme and language menu triggers meet the 48px M3 target", () => {
  assert.ok(themeToggle.includes("h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full"));
  assert.ok(languageSelector.includes("h-12 w-12 shrink-0 cursor-pointer list-none items-center justify-center rounded-full"));
  assert.ok(themeToggle.includes('aria-label={labels.choose + ": " + currentLabel}'));
  assert.ok(languageSelector.includes('aria-label={t.nav.language + ": " + currentLanguage.nativeLabel}'));
});

test("global header search uses the shared ref-capable M3 IconButton at every breakpoint", () => {
  assert.ok(headerSearch.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(headerSearch.includes("<IconButton"));
  assert.ok(headerSearch.includes("ref={triggerRef}"));
  assert.ok(headerSearch.includes('selected={open}'));
  assert.ok(headerSearch.includes('document.getElementById("header-tool-search-input")'));
  assert.ok(headerSearch.includes('data-search-popup-owner="header-tool-search"'));
  assert.doesNotMatch(headerSearch, /lg:hidden|md:hidden|sm:hidden/);
  assert.ok(!headerSearch.includes('const iconButton ='));
});

test("collection and favorites actions use AndroidX-named Button components", () => {
  assert.ok(collectionsView.includes('import { Button, FilledTonalButton, OutlinedButton, TextButton } from "@/components/ui/Button"'));
  assert.ok(collectionsView.includes('<Button type="submit" disabled='));
  assert.ok(collectionsView.includes('<FilledTonalButton type="button"'));
  assert.ok(collectionsView.includes('<OutlinedButton type="button"'));
  assert.ok(collectionsView.includes('<TextButton type="button"'));
  assert.ok(!collectionsView.includes('<button type="submit"'));
  assert.ok(!collectionsView.includes('<button type="button" onClick={() => void data.removeTool'));
  assert.ok(!collectionsView.includes('<button type="button" onClick={() => void data.toggleSharing'));
  assert.ok(collectionsView.includes('colors={{ contentColor: "var(--error)" }}'));
  assert.ok(collectionsView.includes('colors={{ contentColor: "var(--on-surface-variant)" }}'));
  assert.ok(collectionsView.includes('<MaterialIcon name="delete" size={18} />'));
  assert.ok(favoritesView.includes('import { TextButton } from "@/components/ui/Button"'));
  assert.ok(favoritesView.includes('<TextButton type="button" disabled={favorites.loading || favorites.error}'));
  assert.ok(!favoritesView.includes('variant="text"'));
  assert.ok(!favoritesView.includes('min-h-11 rounded-full px-3 text-sm font-bold text-[var(--primary)]'));
});

test("Button ripple is pointer-origin, bounded, cleans up after release and respects reduced motion", () => {
  for (const required of [
    "event.clientX - rect.left",
    "event.clientY - rect.top",
    "Math.hypot(width - x, height - y)",
    "setPointerCapture(event.pointerId)",
    "onPointerCancel={releasePointer}",
    "onLostPointerCapture={releasePointer}",
    'isAnchor ? event.key !== "Enter" : event.key !== " " && event.key !== "Enter"',
    "candidate instanceof HTMLAnchorElement",
    "isDisabledControl(control)",
    "control.addEventListener(\"keydown\", handleKeyDown)",
    "control.addEventListener(\"keyup\", handleKeyUp)",
    "control.addEventListener(\"blur\", handleBlur)",
    'event.animationName !== "button-ripple-fade"',
  ]) {
    assert.ok(buttonRipple.includes(required), "missing ripple interaction behavior: " + required);
  }
  for (const required of [
    ".button-ripple-layer {",
    "button:disabled > .button-ripple-layer",
    "border-radius: inherit",
    "button-ripple-expand",
    "button-ripple-fade",
    ".button-ripple { display: none; }",
    'a[data-material-button-link="true"]:active > .button-ripple-layer::after { opacity: 0.1; }',
  ]) {
    assert.ok(globalCss.includes(required), "missing ripple rendering rule: " + required);
  }
  assert.ok(auditPreview.includes("bounded ripple") && auditPreview.includes("onde contenue"));
});
