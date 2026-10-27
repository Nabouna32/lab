import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import { Alignment } from "../../components/layout/compose/Alignment.ts";
import {
  getBoxChildStyle,
  getColumnLayoutPresentation,
  getRowLayoutPresentation,
} from "../../components/layout/compose/LayoutStyles.ts";
import { BoxScope, ColumnScope, Modifier, RowScope } from "../../components/layout/compose/Modifier.ts";

const componentSource = (name: string) => readFileSync(
  fileURLToPath(new URL(`../../components/layout/compose/${name}.tsx`, import.meta.url)),
  "utf8",
);

test("Box child alignment maps the default center contract to both CSS axes", () => {
  assert.deepEqual(getBoxChildStyle(Alignment.Center), {
    gridArea: "1 / 1",
    justifySelf: "center",
    alignSelf: "center",
  });
});

test("Box consumes scope operations and preserves the child's generic Modifier chain", () => {
  const source = componentSource("Box");

  assert.match(source, /childProps\.modifier\.boxScopeOptions\(\)/);
  assert.match(source, /childProps\.modifier\.withoutBoxScopeOperations\(\)/);
  assert.match(source, /Children\.map\(children/);

  const modifier = Modifier.then(BoxScope.align(Alignment.BottomEnd)).then(Modifier.width(12));
  const markup = renderToStaticMarkup(modifier.wrap(createElement("span", null, "child")));
  assert.match(markup, /width:12px/);
  assert.doesNotMatch(markup, /boxAlign/);
});

test("Box matchParentSize produces an absolute child filling its parent", () => {
  assert.deepEqual(getBoxChildStyle(Alignment.TopStart, true), {
    gridArea: "1 / 1",
    position: "absolute",
    inset: 0,
    display: "grid",
  });

  assert.match(componentSource("Box"), /getBoxChildStyle\(childAlignment, matchParentSize\)/);
});

test("Row and Column map scope weights to the expected flex styles", () => {
  const rowSource = componentSource("Row");
  const columnSource = componentSource("Column");
  const row = getRowLayoutPresentation();
  const column = getColumnLayoutPresentation();

  assert.match(rowSource, /getRowLayoutPresentation\(horizontalArrangement, verticalAlignment, className, style\)/);
  assert.match(columnSource, /getColumnLayoutPresentation\(verticalArrangement, horizontalAlignment, className, style\)/);
  assert.match(renderToStaticMarkup(Modifier.then(RowScope.weight(2)).wrap(createElement("span"))), /flex-grow:2;flex-shrink:1;flex-basis:0%/);
  assert.match(renderToStaticMarkup(Modifier.then(ColumnScope.weight(3, false)).wrap(createElement("span"))), /flex-grow:0;flex-shrink:1;flex-basis:auto/);
  assert.equal(row.style.display, "flex");
  assert.equal(row.style.flexDirection, "row");
  assert.equal(column.style.display, "flex");
  assert.equal(column.style.flexDirection, "column");
});
