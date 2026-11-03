import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const header = read("../../components/layout/HeaderPreferences.tsx");
const banner = read("../../components/layout/LocalePreferenceBanner.tsx");
const layout = read("../../app/[locale]/layout.tsx");

test("language selection is kept out of the header while theme and hamburger remain", () => {
  assert.doesNotMatch(header, /t\.nav\.language/);
  assert.match(header, /MaterialIcon name="menu"/);
  assert.match(header, /t\.theme\.title/);
});

test("language notice offers the equivalent localized route and can be dismissed", () => {
  assert.match(layout, /<LocalePreferenceBanner/);
  assert.match(banner, /getLocalizedPath\(pathname, preferredLocale\)/);
  assert.match(banner, /setDismissed\(true\)/);
  assert.match(banner, /role="status"/);
  assert.match(banner, /var\(--warning-soft\)/);
});
