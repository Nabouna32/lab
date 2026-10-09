import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { categories, getCategoryColor, getCategoryContainerColor } from "./categories.ts";

const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

test("every category has a distinct light and dark identity color with a container role", () => {
  const lightColors = new Set<string>();
  const darkColors = new Set<string>();

  for (const category of categories) {
    const token = `--category-${category.id}`;
    const declaration = new RegExp(`^${token}:\\s*(#[0-9a-f]{6});`, "gim");
    const values = [...globalCss.matchAll(declaration)].map((match) => match[1]);

    assert.equal(values.length, 2, `${token} should be defined for light and dark themes`);
    assert.ok(values[0], `${token} should have a light theme color`);
    assert.ok(values[1], `${token} should have a dark theme color`);
    lightColors.add(values[0]);
    darkColors.add(values[1]);

    assert.ok(globalCss.includes(`${token}-container:`), `${token} should have a container role`);
    assert.equal(getCategoryColor(category.id), `var(${token})`);
    assert.equal(getCategoryContainerColor(category.id), `var(${token}-container)`);
  }

  assert.equal(lightColors.size, categories.length, "light category colors should be unique");
  assert.equal(darkColors.size, categories.length, "dark category colors should be unique");
});

test("category colors stay separate from semantic status colors", () => {
  const statusTokens = ["--success", "--warning", "--error", "--info"];

  for (const category of categories) {
    const categoryToken = `--category-${category.id}`;
    const categoryValues = [...globalCss.matchAll(new RegExp(`^${categoryToken}:\\s*(#[0-9a-f]{6});`, "gim"))]
      .map((match) => match[1]);

    for (const statusToken of statusTokens) {
      const statusValues = [...globalCss.matchAll(new RegExp(`^${statusToken}:\\s*(#[0-9a-f]{6});`, "gim"))]
        .map((match) => match[1]);

      for (const categoryValue of categoryValues) {
        assert.ok(!statusValues.includes(categoryValue), `${categoryToken} must not reuse ${statusToken}`);
      }
    }
  }
});
