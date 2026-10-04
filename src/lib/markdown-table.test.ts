import assert from "node:assert/strict";
import test from "node:test";
import { createMarkdownTable, resizeMarkdownTable } from "./markdown-table.ts";

test("creates a basic Markdown table", () => {
  assert.equal(
    createMarkdownTable(
      [["Name", "Age"], ["Ada", "36"], ["Linus", "55"]],
      ["left", "right"],
    ),
    "| Name | Age |\n| :--- | ---: |\n| Ada | 36 |\n| Linus | 55 |",
  );
});

test("escapes pipes and normalizes line breaks", () => {
  assert.equal(
    createMarkdownTable(
      [["A|B", "Notes"], ["one\ntwo", ""]],
      ["left", "center"],
    ),
    "| A\\|B | Notes |\n| :--- | :---: |\n| one two |  |",
  );
});

test("fills missing cells and alignments deterministically", () => {
  assert.equal(
    createMarkdownTable([["A"], ["B", "C"]], []),
    "| A |  |\n| :--- | :--- |\n| B | C |",
  );
});

test("returns an empty string for an empty matrix", () => {
  assert.equal(createMarkdownTable([], []), "");
});

test("preserves existing cells and grows with empty cells", () => {
  assert.deepEqual(
    resizeMarkdownTable(
      [["A", "B"], ["C", "D"]],
      ["left", "right"],
      3,
      3,
    ),
    {
      rows: [["A", "B", ""], ["C", "D", ""], ["", "", ""]],
      alignments: ["left", "right", "left"],
    },
  );
});

test("never produces an empty table", () => {
  assert.deepEqual(resizeMarkdownTable([], [], 0, 0), {
    rows: [[""]],
    alignments: ["left"],
  });
});
