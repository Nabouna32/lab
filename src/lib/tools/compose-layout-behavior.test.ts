import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import { Alignment } from "../../components/layout/compose/Alignment.ts";
import { Box } from "../../components/layout/compose/Box.tsx";
import { Column } from "../../components/layout/compose/Column.tsx";
import { Row } from "../../components/layout/compose/Row.tsx";
import { Spacer } from "../../components/layout/compose/Spacer.tsx";
import { BoxScope, ColumnScope, Modifier, RowScope } from "../../components/layout/compose/Modifier.ts";

test("Box aligns each child in the shared grid cell and uses the requested default alignment", () => {
  const markup = renderToStaticMarkup(createElement(
    Box,
    { contentAlignment: Alignment.Center },
    createElement("span", null, "centered"),
  ));

  assert.match(markup, /display:grid/);
  assert.match(markup, /grid-area:1\/1/);
  assert.match(markup, /justify-self:center/);
  assert.match(markup, /align-self:center/);
  assert.match(markup, />centered<\/span>/);
});

test("Box consumes child scope modifiers before rendering the child's generic modifier chain", () => {
  const markup = renderToStaticMarkup(createElement(
    Box,
    null,
    createElement(Spacer, {
      modifier: Modifier.then(BoxScope.align(Alignment.BottomEnd)).then(Modifier.width(12)),
    }),
  ));

  assert.match(markup, /justify-self:end/);
  assert.match(markup, /align-self:end/);
  assert.match(markup, /width:12px/);
  assert.doesNotMatch(markup, /boxAlign/);
});

test("Box matchParentSize positions the child against its parent without affecting normal child sizing", () => {
  const markup = renderToStaticMarkup(createElement(
    Box,
    null,
    createElement(Spacer, { modifier: Modifier.then(BoxScope.matchParentSize()) }),
    createElement("span", null, "measured child"),
  ));

  assert.match(markup, /position:absolute;inset:0;display:grid/);
  assert.match(markup, />measured child<\/span>/);
});

test("Row and Column expose scope weights on their direct layout children", () => {
  const row = renderToStaticMarkup(createElement(
    Row,
    null,
    createElement(Spacer, { modifier: Modifier.then(RowScope.weight(2)) }),
    createElement(Spacer, { modifier: Modifier.then(RowScope.weight(1)) }),
  ));
  const column = renderToStaticMarkup(createElement(
    Column,
    null,
    createElement(Spacer, { modifier: Modifier.then(ColumnScope.weight(3, false)) }),
  ));

  assert.match(row, /display:flex;flex-direction:row/);
  assert.match(row, /flex-grow:2;flex-shrink:1;flex-basis:0%/);
  assert.match(row, /flex-grow:1;flex-shrink:1;flex-basis:0%/);
  assert.match(column, /display:flex;flex-direction:column/);
  assert.match(column, /flex-grow:0;flex-shrink:1;flex-basis:auto/);
});
