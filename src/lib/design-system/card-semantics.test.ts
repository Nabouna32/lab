import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const cardSource = readFileSync(new URL("../../components/ui/Card.tsx", import.meta.url), "utf8");

test("non-interactive Card variants remain semantic containers", () => {
  for (const name of ["Card", "ElevatedCard", "OutlinedCard"]) {
    const start = cardSource.indexOf(`export function ${name}(`);
    assert.notEqual(start, -1, `missing ${name} export`);

    const nextExport = cardSource.indexOf("\nexport function ", start + 1);
    const implementation = cardSource.slice(start, nextExport === -1 ? undefined : nextExport);
    assert.match(implementation, /return <div\b/);
    assert.doesNotMatch(implementation, /<Link\b|<button\b/);
  }
});

test("CardLink keeps navigation as a native link with the supplied href", () => {
  const start = cardSource.indexOf("export function CardLink(");
  assert.notEqual(start, -1, "missing CardLink export");

  const implementation = cardSource.slice(start);
  assert.match(implementation, /return <Link href=\{href\}/);
  assert.doesNotMatch(implementation, /return <div\b|<button\b/);
});
