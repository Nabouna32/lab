import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const homeSource = readFileSync(new URL("../../app/[locale]/page.tsx", import.meta.url), "utf8");

test("homepage remains localized and exposes the primary page landmark", () => {
  assert.match(homeSource, /export default async function HomePage/);
  assert.match(homeSource, /isLocale\(locale\)/);
  assert.match(homeSource, /getMessages\(locale\)/);
  assert.match(homeSource, /<main\b/);
  assert.match(homeSource, /aria-labelledby=/);
});

test("homepage metadata is generated from the active locale", () => {
  assert.match(homeSource, /export async function generateMetadata/);
  assert.match(homeSource, /getPublicPageMetadata/);
  assert.match(homeSource, /title: t\.home\.metaTitle/);
  assert.match(homeSource, /description: t\.home\.description/);
  assert.match(homeSource, /path: `\/\$\{locale\}`/);
});
