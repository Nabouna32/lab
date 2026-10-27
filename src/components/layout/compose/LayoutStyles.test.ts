import assert from "node:assert/strict";
import { test } from "node:test";
import { AbsoluteAlignment, Alignment } from "./Alignment.ts";
import { Arrangement } from "./Arrangement.ts";
import { getBoxChildStyle, getColumnLayoutPresentation, getRowLayoutPresentation } from "./LayoutStyles.ts";

test("Row maps every main-axis arrangement to the expected flex alignment", () => {
  const cases = [
    [Arrangement.Start, "flex-start"],
    [Arrangement.End, "flex-end"],
    [Arrangement.Center, "center"],
    [Arrangement.SpaceBetween, "space-between"],
    [Arrangement.SpaceAround, "space-around"],
    [Arrangement.SpaceEvenly, "space-evenly"],
  ] as const;

  for (const [arrangement, expected] of cases) {
    assert.equal(getRowLayoutPresentation(arrangement).style.justifyContent, expected);
  }
});

test("Row preserves fixed spacing and applies its optional group alignment", () => {
  assert.deepEqual(getRowLayoutPresentation(Arrangement.spacedBy(12), Alignment.Bottom).style, {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: "12px",
  });
  assert.equal(
    getRowLayoutPresentation(Arrangement.spacedBy(12, Alignment.End)).style.justifyContent,
    "flex-end",
  );
  assert.equal(
    getRowLayoutPresentation(Arrangement.spacedByCss("var(--space-4)")).style.gap,
    "var(--space-4)",
  );
});

test("Row exposes negative spacing through the documented overlap adapter", () => {
  const result = getRowLayoutPresentation(Arrangement.spacedBy(-8), Alignment.CenterVertically, "custom-row");
  assert.equal(result.className, "custom-row compose-layout-negative-gap-row");
  assert.equal(result.style.gap, 0);
  assert.equal(Reflect.get(result.style, "--compose-layout-negative-gap"), "-8px");
});

test("Column maps main-axis arrangements and keeps the requested cross-axis alignment", () => {
  assert.equal(getColumnLayoutPresentation(Arrangement.Center, Alignment.CenterHorizontally).style.justifyContent, "center");
  assert.equal(getColumnLayoutPresentation(Arrangement.SpaceBetween).style.justifyContent, "space-between");
  assert.equal(getColumnLayoutPresentation(Arrangement.spacedBy(16)).style.gap, "16px");
  assert.equal(
    getColumnLayoutPresentation(Arrangement.spacedBy(16, Alignment.Bottom)).style.justifyContent,
    "flex-end",
  );
  assert.equal(
    getColumnLayoutPresentation(Arrangement.aligned(Alignment.CenterVertically)).style.justifyContent,
    "center",
  );
});

test("Column keeps absolute left/right alignment explicit for RTL-aware CSS", () => {
  const left = getColumnLayoutPresentation(Arrangement.Top, AbsoluteAlignment.Left, "custom-column");
  const right = getColumnLayoutPresentation(Arrangement.Top, AbsoluteAlignment.Right);

  assert.equal(left.className, "custom-column compose-column-align-absolute-left");
  assert.equal(left.style.alignItems, undefined);
  assert.equal(right.className, "compose-column-align-absolute-right");
  assert.equal(right.style.alignItems, undefined);
});

test("caller-provided styles override computed defaults without dropping arrangement metadata", () => {
  const result = getRowLayoutPresentation(Arrangement.spacedBy(-4), Alignment.CenterVertically, "row", {
    justifyContent: "center",
    gap: "2rem",
  });

  assert.equal(result.style.justifyContent, "center");
  assert.equal(result.style.gap, "2rem");
  assert.equal(Reflect.get(result.style, "--compose-layout-negative-gap"), "-4px");
  assert.equal(result.className, "row compose-layout-negative-gap-row");
});


test("Box maps logical alignments to CSS grid self-alignment", () => {
  const cases = [
    [Alignment.TopStart, "start", "start"],
    [Alignment.TopCenter, "center", "start"],
    [Alignment.TopEnd, "end", "start"],
    [Alignment.CenterStart, "start", "center"],
    [Alignment.Center, "center", "center"],
    [Alignment.CenterEnd, "end", "center"],
    [Alignment.BottomStart, "start", "end"],
    [Alignment.BottomCenter, "center", "end"],
    [Alignment.BottomEnd, "end", "end"],
  ] as const;

  for (const [alignment, justifySelf, alignSelf] of cases) {
    assert.deepEqual(getBoxChildStyle(alignment), {
      gridArea: "1 / 1",
      justifySelf,
      alignSelf,
    });
  }
});

test("Box absolute alignments stay physical in RTL and matchParentSize fills its parent", () => {
  assert.deepEqual(getBoxChildStyle(AbsoluteAlignment.TopLeft), {
    gridArea: "1 / 1",
    justifySelf: "left",
    alignSelf: "start",
  });
  assert.deepEqual(getBoxChildStyle(AbsoluteAlignment.BottomRight), {
    gridArea: "1 / 1",
    justifySelf: "right",
    alignSelf: "end",
  });
  assert.deepEqual(getBoxChildStyle(Alignment.Center, true), {
    gridArea: "1 / 1",
    position: "absolute",
    inset: 0,
    display: "grid",
  });
});
