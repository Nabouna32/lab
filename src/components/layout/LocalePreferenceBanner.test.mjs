import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const header = read("../../components/layout/HeaderPreferences.tsx");
const banner = read("../../components/layout/LocalePreferenceBanner.tsx");
const layout = read("../../app/[locale]/layout.tsx");
const localeRoute = read("../../app/api/account/locale-preference/route.ts");

test("language selection is kept out of the header while theme and hamburger remain", () => {
  assert.doesNotMatch(header, /t\.nav\.language/);
  assert.match(header, /MaterialIcon name="menu"/);
  assert.match(header, /t\.theme\.title/);
});

test("the notice only renders for a mismatched account locale and offers the equivalent route", () => {
  assert.match(layout, /<LocalePreferenceBanner locale=\{locale\}/);
  assert.match(banner, /getLocalizedPath\(pathname, preferredLocale\)/);
  assert.match(banner, /setNoticeState\(\{ pathname, preferredLocale, dismissed: true \}\)/);
  assert.match(banner, /role="status"/);
  assert.match(banner, /var\(--warning-soft\)/);
  assert.match(banner, /cache: "no-store"/);
});

test("the preference endpoint verifies the session and returns a private, uncached locale", () => {
  assert.match(localeRoute, /supabase\.auth\.getClaims\(\)/);
  assert.match(localeRoute, /\.select\("locale"\)/);
  assert.match(localeRoute, /Cache-Control.*private, no-store/);
});
