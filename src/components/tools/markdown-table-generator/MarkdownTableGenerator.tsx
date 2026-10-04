"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { createMarkdownTable, resizeMarkdownTable, type MarkdownTableAlignment } from "@/lib/markdown-table";

const DEFAULT_ROWS = [
  ["Header 1", "Header 2", "Header 3"],
  ["", "", ""],
  ["", "", ""],
];
const MIN_COLUMNS = 1;
const MAX_COLUMNS = 8;
const MIN_ROWS = 1;
const MAX_ROWS = 20;

export default function MarkdownTableGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).markdownTable;
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [alignments, setAlignments] = useState<MarkdownTableAlignment[]>(["left", "left", "left"]);
  const markdown = useMemo(() => createMarkdownTable(rows, alignments), [rows, alignments]);

  function resize(nextRowCount: number, nextColumnCount: number) {
    const resized = resizeMarkdownTable(rows, alignments, nextRowCount, nextColumnCount);
    setRows(resized.rows);
    setAlignments(resized.alignments);
  }

  function updateCell(rowIndex: number, columnIndex: number, value: string) {
    setRows((current) => current.map((row, currentRowIndex) =>
      currentRowIndex === rowIndex
        ? row.map((cell, currentColumnIndex) => currentColumnIndex === columnIndex ? value : cell)
        : row,
    ));
  }

  function updateAlignment(columnIndex: number, alignment: MarkdownTableAlignment) {
    setAlignments((current) => current.map((value, index) => index === columnIndex ? alignment : value));
  }

  function reset() {
    setRows(DEFAULT_ROWS);
    setAlignments(["left", "left", "left"]);
  }

  const rowCount = rows.length;
  const columnCount = rows[0]?.length ?? 0;

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="p-4 sm:p-6 lg:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.table}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{t.hint}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => resize(rowCount, Math.min(MAX_COLUMNS, columnCount + 1))} disabled={columnCount >= MAX_COLUMNS}>{t.addColumn}</Button>
            <Button type="button" variant="secondary" onClick={() => resize(Math.min(MAX_ROWS, rowCount + 1), columnCount)} disabled={rowCount >= MAX_ROWS}>{t.addRow}</Button>
            <Button type="button" variant="secondary" onClick={() => resize(rowCount, Math.max(MIN_COLUMNS, columnCount - 1))} disabled={columnCount <= MIN_COLUMNS}>{t.removeColumn}</Button>
            <Button type="button" variant="secondary" onClick={() => resize(Math.max(MIN_ROWS, rowCount - 1), columnCount)} disabled={rowCount <= MIN_ROWS}>{t.removeRow}</Button>
            <ClearButton onClear={reset} label={t.reset} />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)]">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--background)]">
                {rows[0].map((_, columnIndex) => (
                  <th key={columnIndex} scope="col" className="min-w-40 border-b border-[var(--border)] p-3 text-left align-top">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {t.column} {columnIndex + 1}
                      <select
                        aria-label={t.alignmentLabel(columnIndex + 1)}
                        value={alignments[columnIndex]}
                        onChange={(event) => updateAlignment(columnIndex, event.target.value as MarkdownTableAlignment)}
                        className="mt-2 block min-h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-2 text-sm font-normal normal-case tracking-normal text-[var(--foreground)]"
                      >
                        <option value="left">{t.left}</option>
                        <option value="center">{t.center}</option>
                        <option value="right">{t.right}</option>
                      </select>
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, columnIndex) => (
                    <td key={columnIndex} className="border-t border-[var(--border)] p-2 align-top">
                      <label className="sr-only" htmlFor={"markdown-table-" + rowIndex + "-" + columnIndex}>
                        {(rowIndex === 0 ? t.headerCell : t.bodyCell) + " " + (rowIndex + 1) + ", " + t.column + " " + (columnIndex + 1)}
                      </label>
                      <input
                        id={"markdown-table-" + rowIndex + "-" + columnIndex}
                        value={cell}
                        onChange={(event) => updateCell(rowIndex, columnIndex, event.target.value)}
                        className="min-h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{t.markdown}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{t.outputHint}</p>
              </div>
              <CopyButton value={markdown} label={t.copy} />
            </div>
            <pre className="mt-3 min-h-52 overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs leading-5 text-[var(--foreground)]" aria-label={t.markdown}>{markdown}</pre>
          </div>

          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.preview}</p>
            <div className="mt-3 min-h-52 overflow-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] p-4">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr>
                    {rows[0].map((cell, columnIndex) => (
                      <th key={columnIndex} className="border-b border-[var(--border)] px-3 py-2" style={{ textAlign: alignments[columnIndex] }}>{cell || " "}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, columnIndex) => (
                        <td key={columnIndex} className="border-b border-[var(--border)] px-3 py-2" style={{ textAlign: alignments[columnIndex] }}>{cell || " "}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
