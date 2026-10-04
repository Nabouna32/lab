import { describe, expect, it } from "vitest";
import { createMarkdownTable, resizeMarkdownTable } from "./markdown-table.ts";

describe("createMarkdownTable", () => {
  it("creates a basic Markdown table", () => {
    expect(createMarkdownTable(
      [["Name", "Age"], ["Ada", "36"], ["Linus", "55"]],
      ["left", "right"],
    )).toBe("| Name | Age |\n| :--- | ---: |\n| Ada | 36 |\n| Linus | 55 |");
  });

  it("escapes pipes and normalizes line breaks", () => {
    expect(createMarkdownTable(
      [["A|B", "Notes"], ["one\ntwo", ""]],
      ["left", "center"],
    )).toBe("| A\\|B | Notes |\n| :--- | :---: |\n| one two |  |");
  });

  it("fills missing cells and alignments deterministically", () => {
    expect(createMarkdownTable([["A"], ["B", "C"]], [])).toBe("| A |  |\n| :--- | :--- |\n| B | C |");
  });

  it("returns an empty string for an empty matrix", () => {
    expect(createMarkdownTable([], [])).toBe("");
  });
});

describe("resizeMarkdownTable", () => {
  it("preserves existing cells and grows with empty cells", () => {
    expect(resizeMarkdownTable(
      [["A", "B"], ["C", "D"]],
      ["left", "right"],
      3,
      3,
    )).toEqual({
      rows: [["A", "B", ""], ["C", "D", ""], ["", "", ""]],
      alignments: ["left", "right", "left"],
    });
  });

  it("never produces an empty table", () => {
    expect(resizeMarkdownTable([], [], 0, 0)).toEqual({
      rows: [[""]],
      alignments: ["left"],
    });
  });
});
