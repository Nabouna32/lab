import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import { Card, CardLink, ElevatedCard, OutlinedCard } from "../../components/ui/Card.tsx";

test("non-interactive Card variants render semantic containers, not links or buttons", () => {
  for (const Component of [Card, ElevatedCard, OutlinedCard]) {
    const markup = renderToStaticMarkup(createElement(Component, null, "Card content"));

    assert.match(markup, /^<div(?:\s|>)/);
    assert.match(markup, /Card content/);
    assert.doesNotMatch(markup, /\shref=/);
    assert.doesNotMatch(markup, /<button\b/);
  }
});

test("CardLink renders a real localized navigation anchor", () => {
  const markup = renderToStaticMarkup(
    createElement(CardLink, { href: "/fr/outils/percentage" }, "Percentage calculator"),
  );

  assert.match(markup, /^<a\b/);
  assert.match(markup, /href="\/fr\/outils\/percentage"/);
  assert.match(markup, /Percentage calculator/);
  assert.doesNotMatch(markup, /^<div\b/);
});
