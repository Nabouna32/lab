import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const button = readFileSync(new URL("../../components/ui/Button.tsx", import.meta.url), "utf8");
const submitButton = readFileSync(new URL("../../components/account/SubmitButton.tsx", import.meta.url), "utf8");
const buttonVariantStyles = readFileSync(new URL("../../components/ui/material-button-variant-styles.ts", import.meta.url), "utf8");
const buttonLayout = readFileSync(new URL("../../components/ui/material-button-layout.ts", import.meta.url), "utf8");
const buttonRipple = readFileSync(new URL("../../components/ui/ButtonRipple.tsx", import.meta.url), "utf8");
const iconButton = readFileSync(new URL("../../components/ui/IconButton.tsx", import.meta.url), "utf8");
const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const favoriteButton = readFileSync(new URL("../../components/favorites/FavoriteButton.tsx", import.meta.url), "utf8");
const baseConverter = readFileSync(new URL("../../components/tools/number-base-converter/NumberBaseConverter.tsx", import.meta.url), "utf8");
const languageSelector = readFileSync(new URL("../../components/layout/LanguageSelector.tsx", import.meta.url), "utf8");
const headerSearch = readFileSync(new URL("../../components/layout/HeaderSearch.tsx", import.meta.url), "utf8");
const secureTextField = readFileSync(new URL("../../components/ui/OutlinedSecureTextField.tsx", import.meta.url), "utf8");
const toolSearch = readFileSync(new URL("../../components/tools/ToolSearch.tsx", import.meta.url), "utf8");
const unitConverter = readFileSync(new URL("../../components/tools/unit-converter/UnitConverter.tsx", import.meta.url), "utf8");
const collectionsView = readFileSync(new URL("../../components/collections/CollectionsView.tsx", import.meta.url), "utf8");
const favoritesView = readFileSync(new URL("../../components/favorites/FavoritesView.tsx", import.meta.url), "utf8");
const adminUsers = readFileSync(new URL("../../app/[locale]/admin/utilisateurs/page.tsx", import.meta.url), "utf8");
const timezoneConverter = readFileSync(new URL("../../components/tools/timezone-converter/TimezoneConverter.tsx", import.meta.url), "utf8");
const signInPage = readFileSync(new URL("../../app/[locale]/compte/connexion/page.tsx", import.meta.url), "utf8");
const appLink = readFileSync(new URL("../../components/ui/AppLink.tsx", import.meta.url), "utf8");
const recentTools = readFileSync(new URL("../../components/home/RecentTools.tsx", import.meta.url), "utf8");

test("shared Button exports AndroidX component names with source-derived dimensions and variant-specific states", () => {
  for (const component of ["Button", "ElevatedButton", "FilledTonalButton", "OutlinedButton", "TextButton"]) {
    assert.ok(button.includes("export function " + component + "("), "missing AndroidX component export: " + component);
  }
  assert.ok(button.includes("export type ButtonColors ="), "official button exports expose AndroidX-inspired color customization");
  assert.ok(button.includes("enabled?: boolean"));
  assert.ok(button.includes("disabled={disabled ?? !enabled}"), "AndroidX enabled maps to the native disabled state");
  assert.ok(button.includes("export type ButtonContentPadding ="));
  assert.ok(button.includes('shape?: CSSProperties["borderRadius"]'));
  assert.ok(button.includes('border?: CSSProperties["border"] | null'));
  assert.ok(button.includes("contentPadding?: ButtonContentPadding"));
  assert.ok(button.includes("paddingInlineStart: contentPadding.start"), "content padding preserves AndroidX logical start/end in RTL layouts");
  assert.ok(button.includes("border: border ?? \"none\""), "a null border maps to no CSS border");
  assert.ok(buttonVariantStyles.includes("disabledContainerColor?: string") && buttonVariantStyles.includes("disabledContentColor?: string"));
  assert.ok(!button.includes("DestructiveButton"), "no Loculary-only destructive component remains");
  const buttonContract = button + buttonVariantStyles + buttonLayout;
  for (const required of [
    "min-h-10", "min-w-[58px]", "whitespace-nowrap", "whitespace-pre-line",
    "leadingIcon?: boolean", "multiline?: boolean", "ps-3 pe-4", "ps-4 pe-6",
    "transition-[background-color,border-color,color,box-shadow]", "motion-reduce:transition-none",
    "--button-disabled-container-color",
    "--button-disabled-content-color",
    "disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)]",
    "hover:shadow-[var(--button-elevation-1)]", "hover:shadow-[var(--button-elevation-2)]",
    "focus-visible:shadow-[var(--button-elevation-1)]", "focus-visible:bg-[color-mix(in_srgb,var(--button-container-color)_90%,var(--button-content-color,var(--primary)))]", "<ButtonRipple />",
    'type = "button"',
  ]) assert.ok(buttonContract.includes(required), "missing Button contract: " + required);
  assert.ok(!button.includes('variant?: ButtonVariant'), "public Button API must use AndroidX-named components, not a variant prop");
  assert.ok(!button.includes("primary: filled") && !button.includes("secondary: outlined"), "Loculary legacy aliases must not remain in the public API");
  assert.ok(globalCss.includes("--button-elevation-1:") && globalCss.includes("--button-elevation-2:"));
  assert.ok(globalCss.includes(".button-ripple__fill {\n  position: absolute;\n  inset: 0;\n  display: block;\n  border-radius: inherit;\n  background: currentColor;\n  opacity: 0.1;"));
  assert.ok(globalCss.includes('a[data-material-button-link="true"]:active .button-ripple-layer::after { opacity: 0.1; }'));
  assert.ok(!button.includes("active:rounded-[var(--shape-corner-small)]"), "pressed state must not morph the shape in the selected Fidelity direction");
});

test("Button disabled colors follow AndroidX variant token roles", () => {
  const variantStyle = (name) => {
    const start = buttonVariantStyles.indexOf(`const ${name} = [`);
    if (start < 0) return "";
    const end = buttonVariantStyles.indexOf("].join", start);
    return end < 0 ? "" : buttonVariantStyles.slice(start, end);
  };
  assert.ok(variantStyle("filled").includes("var(--on-surface)_10%") && variantStyle("filled").includes("var(--on-surface)_38%"));
  assert.ok(variantStyle("elevated").includes("var(--on-surface)_10%") && variantStyle("elevated").includes("var(--on-surface)_38%"));
  assert.ok(variantStyle("filledTonal").includes("var(--on-surface)_12%") && variantStyle("filledTonal").includes("var(--on-surface)_38%"));
  assert.ok(variantStyle("outlined").includes("var(--outline-variant)_10%") && variantStyle("outlined").includes("var(--on-surface-variant)_38%"));
  assert.ok(variantStyle("text").includes("var(--on-surface-variant)_38%"));

  assert.ok(buttonVariantStyles.includes("color-mix(in_srgb,var(--on-surface)_38%,transparent)"), "disabled labels use the AndroidX on-surface role at 38% opacity");
  assert.ok(buttonVariantStyles.includes("disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_10%,transparent))]"), "Filled and Elevated disabled containers use on-surface at 10% opacity");
  assert.ok(buttonVariantStyles.includes("disabled:bg-[var(--button-disabled-container-color,color-mix(in_srgb,var(--on-surface)_12%,transparent))]"), "FilledTonal disabled container uses on-surface at 12% opacity");
  assert.ok(buttonVariantStyles.includes("disabled:border-[color-mix(in_srgb,var(--outline-variant)_10%,transparent)]"), "OutlinedButton disabled outline uses outline-variant at 10% opacity");
  assert.ok(buttonVariantStyles.includes("disabled:text-[color:var(--button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]"), "Outlined and TextButton disabled content uses on-surface-variant at 38%");
  assert.ok(!buttonVariantStyles.includes("disabled:bg-[var(--button-disabled-container-color,var(--surface-container-low))]"), "ElevatedButton must not retain its enabled container as the disabled default");
  assert.ok(buttonVariantStyles.includes("hover:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_92%,var(--button-content-color,var(--on-primary)))]"), "hover state layer opacity is 8%");
  assert.ok(buttonVariantStyles.includes("focus-visible:bg-[color-mix(in_srgb,var(--button-container-color,var(--primary))_90%,var(--button-content-color,var(--on-primary)))]"), "focus state layer opacity is 10%");
  assert.ok(buttonVariantStyles.includes("color-mix(in srgb, var(--surface) 94.88%, var(--surface-tint))"));
  assert.ok(buttonVariantStyles.includes("color-mix(in srgb, var(--surface) 93.06%, var(--surface-tint))"));
  assert.ok(submitButton.includes("color-mix(in srgb, var(--on-surface) 10%, transparent)"));
  assert.ok(submitButton.includes("color-mix(in srgb, var(--on-surface) 38%, transparent)"));
});


test("button-styled links preserve anchors and share the ripple interaction", () => {
  assert.match(appLink, /import NextLink, \{ type LinkProps \} from "next\/link"/);
  assert.match(appLink, /data-material-button-link=\{isMaterialButton \? "true" : undefined\}/);
  assert.match(appLink, /isMaterialButton \? <ButtonRipple \/> : null/);
  assert.match(appLink, /materialButtonVariantStyles\[variant\]/);
  assert.match(button, /getMaterialButtonLayoutClasses\(variant, \{ leadingIcon, multiline \}\)/);
  assert.match(appLink, /getMaterialButtonLayoutClasses\(variant, \{ leadingIcon \}\)/);
  assert.doesNotMatch(timezoneConverter, /className="[^"]*px-2/);
  assert.match(timezoneConverter, /aria-label=\{t\.removeDestination \+ " " \+ zone\}/);
  assert.match(timezoneConverter, /disabled=\{destinationTimeZones\.length <= 1\}/);
  assert.match(buttonLayout, /min-h-10/);
  assert.match(buttonLayout, /min-w-\[58px\]/);
  assert.match(buttonLayout, /ps-3 pe-4/);
  assert.match(buttonLayout, /ps-4 pe-6/);
  assert.match(appLink, /getMaterialButtonInlineStyle\(isMaterialButton/);
});

test("recent tools clear action uses the shared TextButton", () => {
  assert.match(recentTools, /import \{ TextButton \} from "@\/components\/ui\/Button"/);
  assert.match(recentTools, /<TextButton type="button" onClick=\{clearRecentTools\}/);
  assert.doesNotMatch(recentTools, /<button type="button" onClick=\{clear\}/);
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

test("generic tool and dialog actions use the shared AndroidX Button ports", () => {
  const expenseSplitter = readFileSync(new URL("../../components/tools/expense-splitter/ExpenseSplitter.tsx", import.meta.url), "utf8");
  const datePickerDialog = readFileSync(new URL("../../components/ui/DatePickerDialog.tsx", import.meta.url), "utf8");
  const timePickerDialog = readFileSync(new URL("../../components/ui/TimePickerDialog.tsx", import.meta.url), "utf8");
  const datePickerCss = readFileSync(new URL("../../components/ui/DatePickerDialog.module.css", import.meta.url), "utf8");

  assert.ok(expenseSplitter.includes('import { Button, OutlinedButton } from "@/components/ui/Button"'));
  assert.ok(!expenseSplitter.includes("buttonClass"), "legacy local action styles must be removed after migration");
  assert.ok(datePickerDialog.includes("<TextButton ref={cancelRef}"));
  assert.ok(datePickerDialog.includes("<Button type=\"button\""));
  assert.ok(timePickerDialog.includes("<TextButton ref={cancelRef}"));
  assert.ok(timePickerDialog.includes("<Button type=\"button\""));
  assert.ok(!datePickerCss.includes(".textAction") && !datePickerCss.includes(".confirmAction"));
});

test("icon button API separates official action variants from toggle variants", () => {
  for (const component of ["IconButton", "FilledIconButton", "FilledTonalIconButton", "OutlinedIconButton", "IconToggleButton", "FilledIconToggleButton", "FilledTonalIconToggleButton", "OutlinedIconToggleButton"]) {
    assert.ok(iconButton.includes("export function " + component + "("), "missing AndroidX icon button API: " + component);
  }
  assert.ok(!iconButton.includes("type IconButtonVariant ="), "the old variant-based API must not remain");
  assert.ok(!iconButton.includes("tonal: filledTonal"), "non-AndroidX tonal alias must be removed");
  assert.ok(!iconButton.includes("selected?: boolean"), "toggle state belongs to dedicated toggle components");
  assert.ok(iconButton.includes("checked: boolean") && iconButton.includes("onCheckedChange: (checked: boolean) => void"));
  assert.ok(iconButton.includes("h-12 min-h-12 w-12 min-w-12"));
  assert.ok(iconButton.includes("h-10 min-h-10 w-10 min-w-10"));
  assert.ok(iconButton.includes("aria-pressed={isToggle ? checked : undefined}"), "toggle buttons expose their pressed state");
  assert.ok(iconButton.includes('aria-hidden="true"'));
  assert.ok(iconButton.includes('import { ButtonRipple } from "@/components/ui/ButtonRipple"'));
  assert.ok(iconButton.includes("<ButtonRipple />"), "icon buttons use the shared bounded ripple adaptation");
  assert.ok(iconButton.includes("group relative isolate inline-flex"), "the ripple layer is positioned inside the native button");

  assert.ok(iconButton.includes("relative isolate inline-flex shrink-0 items-center justify-center rounded-full"), "the 40px surface clips the ripple separately from the 48px touch target");
  assert.ok(iconButton.includes("var(--secondary-container)") && iconButton.includes("var(--on-secondary-container)"));
  assert.ok(iconButton.includes("ref?: Ref<HTMLButtonElement>"));
  assert.ok(iconButton.includes("enabled?: boolean"));
  assert.ok(iconButton.includes("disabled={disabled ?? !enabled}"), "AndroidX enabled maps to the native disabled state");
  assert.ok(iconButton.includes("export type IconButtonColors ="));
  assert.ok(iconButton.includes("export type IconToggleButtonColors ="));
  assert.ok(iconButton.includes("colors?: Partial<IconButtonColors>"));
  assert.ok(iconButton.includes("colors?: Partial<IconToggleButtonColors>"));
  assert.ok(iconButton.includes('shape?: CSSProperties["borderRadius"]'));
  assert.ok(iconButton.includes("type OutlinedIconButtonProps = IconButtonProps &"));
  assert.ok(iconButton.includes("type OutlinedIconToggleButtonProps = IconToggleButtonProps &"));
  assert.ok(iconButton.includes('border?: CSSProperties["border"] | null'));
  assert.ok(iconButton.includes('border: border ?? "none"'), "outlined border maps to CSS and null removes it");
  assert.ok(iconButton.includes('"--icon-button-checked-container-color": colors?.checkedContainerColor'));
  assert.ok(iconButton.includes("borderRadius: shape"), "Compose shape is mapped to a documented CSS border-radius adaptation");
});

test("icon toggle states use their own AndroidX color roles instead of action-button defaults", () => {
  const iconStyleLine = (prefix) => iconButton.split("\n").find((line) => line.trimStart().startsWith(prefix)) ?? "";
  assert.ok(iconStyleLine("const filled =").includes("var(--on-surface)_38%"));
  assert.ok(iconStyleLine("const filledTonal =").includes("var(--on-surface)_38%"));
  assert.ok(iconStyleLine("const outlined =").includes("var(--outline-variant)_38%") && iconStyleLine("const outlined =").includes("var(--on-surface)_38%"));
  assert.ok(iconStyleLine("standard: ").includes("var(--on-surface-variant)_38%"));
  assert.ok(iconButton.split("\n").filter((line) => line.trimStart().startsWith("filled: ")).every((line) => line.includes("var(--on-surface)_38%")));
  const toggleStylesStart = iconButton.indexOf("const toggleUncheckedStyles:");
  const toggleStylesEnd = iconButton.indexOf("const targetDimensions", toggleStylesStart);
  const toggleStyles = iconButton.slice(toggleStylesStart, toggleStylesEnd);
  const filledTonalToggleStyles = toggleStyles.split("\n").filter((line) => line.trimStart().startsWith('"filled-tonal": '));
  assert.equal(filledTonalToggleStyles.length, 2, "unchecked and checked filled-tonal toggle styles are both explicit");
  assert.ok(filledTonalToggleStyles.every((line) => line.includes("var(--on-surface)_38%")));

  assert.ok(iconButton.includes("const toggleUncheckedStyles: Record<IconButtonStyle, string>"));
  assert.ok(iconButton.includes("const toggleCheckedStyles: Record<IconButtonStyle, string>"));
  assert.ok(iconButton.includes('filled: "border border-transparent bg-[var(--icon-button-container-color,var(--surface-container))] text-[var(--icon-button-content-color,var(--on-surface-variant))]'));
  assert.ok(iconButton.includes("group-hover:bg-[color-mix(in_srgb,var(--icon-button-container-color,var(--surface-container))_92%,var(--icon-button-content-color,var(--on-surface-variant)))]"), "unchecked filled toggle state layer uses on-surface-variant");
  assert.ok(iconButton.includes('"filled-tonal": "border border-transparent bg-[var(--icon-button-container-color,var(--secondary-container))] text-[var(--icon-button-content-color,var(--on-secondary-container))]'));
  assert.ok(iconButton.includes('filled: "border border-transparent bg-[var(--icon-button-checked-container-color,var(--primary))] text-[var(--icon-button-checked-content-color,var(--on-primary))]'));
  assert.ok(iconButton.includes('"filled-tonal": "border border-transparent bg-[var(--icon-button-checked-container-color,var(--secondary))] text-[var(--icon-button-checked-content-color,var(--on-secondary))]'));
  assert.ok(iconButton.includes('outlined: "border border-transparent bg-[var(--icon-button-checked-container-color,var(--inverse-surface))] text-[var(--icon-button-checked-content-color,var(--inverse-on-surface))]'));
  assert.ok(iconButton.includes("hover 8%, focus 10%, pressed 10%"));
  assert.ok(iconButton.includes("group-focus-visible:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_90%,var(--icon-button-content-color,var(--on-surface-variant)))]"));
  assert.ok(iconButton.includes("group-disabled:border-[color-mix(in_srgb,var(--outline-variant)_38%,transparent)]"));
  assert.ok(iconButton.includes("group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface)_38%,transparent))]"), "filled and outlined vibrant disabled content uses on-surface");
  assert.ok(iconButton.includes("group-disabled:text-[var(--icon-button-disabled-content-color,color-mix(in_srgb,var(--on-surface-variant)_38%,transparent))]"), "standard disabled content follows LocalContentColor");
  assert.ok(iconButton.includes("group-active:bg-[color-mix(in_srgb,var(--icon-button-container-color,transparent)_90%,var(--on-surface-variant))]"), "outlined pressed state uses the AndroidX on-surface-variant role");
  assert.ok(!iconButton.includes("const selectedStyles:"), "legacy selected overlay map must be removed");
});

test("favorite action uses shared M3 controls and never shrinks icon touch target below 48px", () => {
  assert.ok(favoriteButton.includes('import { FilledTonalButton, OutlinedButton } from "@/components/ui/Button"'));
  assert.ok(favoriteButton.includes("IconToggleButton } from"));
  assert.ok(favoriteButton.includes('if (compact)'));
  assert.ok(favoriteButton.includes("<IconToggleButton"));
  assert.ok(favoriteButton.includes('<StarIcon filled={active} size={24} className="h-6 w-6 shrink-0" />'));
  assert.ok(readFileSync(new URL("../../components/ui/StarIcon.tsx", import.meta.url), "utf8").includes("size = 20"));
  assert.ok(favoriteButton.includes("const FavoriteActionButton = active ? FilledTonalButton : OutlinedButton;"));
  assert.ok(favoriteButton.includes("checked={active}") && favoriteButton.includes("onCheckedChange"));
  assert.ok(!favoriteButton.includes("min-h-10 min-w-10"));
});

test("production IconButton consumers preserve action and toggle semantics", () => {
  assert.ok(secureTextField.includes("<IconButton"));
  assert.ok(secureTextField.includes("label={revealed ? hidePasswordLabel : showPasswordLabel}"));
  assert.ok(!secureTextField.includes("<IconToggleButton"), "a changing show/hide label is an action, not a pressed-state toggle");

  const clearStart = toolSearch.indexOf("<IconButton");
  const clearEnd = toolSearch.indexOf("</IconButton>", clearStart);
  const clearButton = toolSearch.slice(clearStart, clearEnd);
  assert.ok(clearStart >= 0 && clearEnd > clearStart);
  assert.ok(clearButton.includes("label={t.tools.clearSearch}"));
  assert.ok(clearButton.includes("onMouseDown={(event) => event.preventDefault()}"));
  assert.ok(clearButton.includes("inputRef.current?.focus();"), "clearing the query restores focus to the search field");
  assert.ok(toolSearch.includes('<FilledIconButton label={t.tools.searchSubmit} type="submit" disabled={!query.trim()}>'));

  assert.ok(unitConverter.includes('<OutlinedIconButton onClick={swapUnits} label={t.swap} title={t.swap}>'));
});

test("number-base swap action uses the shared OutlinedIconButton with a 24px icon", () => {
  assert.ok(baseConverter.includes("OutlinedIconButton"));
  assert.ok(baseConverter.includes("<OutlinedIconButton label={t.swap} title={t.swap} onClick={swapBases}"));
  assert.ok(baseConverter.includes('<MaterialIcon name="swap_horiz" size={24} />'));
  assert.ok(!baseConverter.includes("<IconButton label={t.swap}"));
});

test("icon-only language selector trigger meets the 48px M3 target", () => {
  assert.ok(languageSelector.includes("h-12 w-12 shrink-0 cursor-pointer list-none items-center justify-center rounded-full"));
  assert.ok(languageSelector.includes('aria-label={t.nav.language + ": " + currentLanguage.nativeLabel}'));
});

test("global header search uses the shared ref-capable M3 IconButton at every breakpoint", () => {
  assert.ok(headerSearch.includes('import { IconButton } from "@/components/ui/IconButton"'));
  assert.ok(headerSearch.includes("<IconButton"));
  assert.ok(headerSearch.includes("ref={triggerRef}"));
  assert.ok(headerSearch.includes("aria-expanded={open}"));
  assert.ok(!headerSearch.includes("selected={open}"), "a disclosure trigger is not a toggle button");
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

test("native control font reset stays in Tailwind base layer so Material 3 typography utilities win", () => {
  assert.match(globalCss, /@layer base\s*\{\s*button, input, textarea, select \{ font: inherit; \}\s*\}/);
});


test("admin destructive actions use semantic error roles without shrinking Material 3 targets", () => {
  assert.ok(adminUsers.includes('<TextButton type="submit" colors={{ contentColor: "var(--error)" }}>'));
  assert.ok(adminUsers.includes('<OutlinedButton type="submit" colors={suspended ? undefined : { contentColor: "var(--error)" }}>'));
  assert.doesNotMatch(adminUsers, /min-h-8 px-2 py-1 m3-type-label-small text-\[var\(--danger\)\]/);
  assert.doesNotMatch(adminUsers, /className="text-\[var\(--danger\)\] hover:text-\[var\(--danger\)\]"/);
});


test("search retry OutlinedButton inherits shared Material 3 geometry", () => {
  const retryStart = toolSearch.indexOf('<OutlinedButton\n                type="button"');
  const retryEnd = toolSearch.indexOf("</OutlinedButton>", retryStart);
  assert.ok(retryStart >= 0 && retryEnd > retryStart);
  const retryButton = toolSearch.slice(retryStart, retryEnd);
  assert.ok(retryButton.includes('className="mt-3"'), "only the external layout margin remains local");
  assert.ok(!retryButton.includes("min-h-10"), "the shared minimum height remains authoritative");
  assert.ok(!retryButton.includes("rounded-full"), "the shared shape remains authoritative");
  assert.ok(!retryButton.includes("px-4"), "the shared 24px horizontal content inset remains authoritative");
});

test("resend confirmation selects the shared OutlinedButton variant instead of local visual overrides", () => {
  assert.ok(signInPage.includes('<SubmitButton pendingLabel={t.account.resendConfirmation} variant="outlined">'));
  assert.ok(!signInPage.includes('className="border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-soft)]"'));
  assert.ok(signInPage.includes('<SubmitButton pendingLabel={t.account.submitSignIn} className="w-full">'), "layout-only className remains supported");
});

test("timezone destination removal keeps the shared Material 3 TextButton touch target", () => {
  const buttonStart = timezoneConverter.indexOf('<TextButton type="button" aria-label={t.removeDestination + " " + zone}');
  const classNameStart = timezoneConverter.indexOf('className="shrink-0"', buttonStart);
  const buttonEnd = timezoneConverter.indexOf(">", classNameStart);
  assert.ok(buttonStart >= 0, "the destination removal action remains a native TextButton");
  assert.ok(classNameStart > buttonStart && buttonEnd > classNameStart, "the shared layout-only class belongs to that action");
  const buttonMarkup = timezoneConverter.slice(buttonStart, buttonEnd + 1);
  assert.ok(buttonMarkup.includes('aria-label={t.removeDestination + " " + zone}'));
  assert.ok(buttonMarkup.includes("disabled={destinationTimeZones.length <= 1}"));
  assert.ok(!buttonMarkup.includes("min-h-9"), "the shared 40px minimum height must not be reduced");
  assert.ok(!buttonMarkup.includes("px-2"), "the shared TextButton padding must remain intact");
  assert.match(buttonLayout, /min-h-10/);
});
