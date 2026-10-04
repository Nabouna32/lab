export type MarkdownTableAlignment = "left" | "center" | "right";

export type MarkdownTable = {
  rows: string[][];
  alignments: MarkdownTableAlignment[];
};

function normalizeCell(value: string): string {
  return value.replace(/\r?\n|\r/g, " ").replace(/\|/g, "\\|");
}

function separator(alignment: MarkdownTableAlignment): string {
  if (alignment === "center") return ":---:";
  if (alignment === "right") return "---:";
  return ":---";
}

export function createMarkdownTable(
  rows: readonly (readonly string[])[],
  alignments: readonly MarkdownTableAlignment[],
): string {
  if (rows.length === 0) return "";
  const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (columnCount === 0) return "";

  const normalizedAlignments = Array.from(
    { length: columnCount },
    (_, index) => alignments[index] ?? "left",
  );
  const normalizedRows = rows.map((row) =>
    Array.from({ length: columnCount }, (_, index) => normalizeCell(row[index] ?? "")),
  );
  const header = normalizedRows[0];
  const separatorRow = normalizedAlignments.map(separator);

  return [
    "| " + header.join(" | ") + " |",
    "| " + separatorRow.join(" | ") + " |",
    ...normalizedRows.slice(1).map((row) => "| " + row.join(" | ") + " |"),
  ].join("\n");
}

export function resizeMarkdownTable(
  rows: readonly (readonly string[])[],
  alignments: readonly MarkdownTableAlignment[],
  nextRowCount: number,
  nextColumnCount: number,
): MarkdownTable {
  const rowCount = Math.max(1, nextRowCount);
  const columnCount = Math.max(1, nextColumnCount);
  const nextRows = Array.from({ length: rowCount }, (_, rowIndex) =>
    Array.from({ length: columnCount }, (_, columnIndex) => rows[rowIndex]?.[columnIndex] ?? ""),
  );
  const nextAlignments = Array.from(
    { length: columnCount },
    (_, columnIndex) => alignments[columnIndex] ?? "left",
  );
  return { rows: nextRows, alignments: nextAlignments };
}
