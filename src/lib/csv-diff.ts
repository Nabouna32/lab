export type CsvDiffDelimiter = "auto" | "," | ";" | "\t";
export type CsvDiffKind = "added" | "removed" | "changed";
export type CsvDiffChange = {
  kind: CsvDiffKind;
  key: string;
  fields: string[];
  before?: Record<string, string>;
  after?: Record<string, string>;
};
export type CsvDiffResult = {
  columns: string[];
  keyColumn: string | null;
  changes: CsvDiffChange[];
  added: number;
  removed: number;
  changed: number;
  identical: boolean;
};

export const CSV_DIFF_MAX_CHARS = 200_000;
const CSV_DIFF_MAX_ROWS = 10_000;
const CSV_DIFF_MAX_CHANGES = 500;

export class CsvDiffError extends Error {
  constructor(readonly code: "empty" | "too-large" | "invalid" | "headers" | "duplicate-key" | "missing-key" | "too-many-rows") {
    super(code);
    this.name = "CsvDiffError";
  }
}

function detectDelimiter(input: string): Exclude<CsvDiffDelimiter, "auto"> {
  const candidates: Array<Exclude<CsvDiffDelimiter, "auto">> = [",", ";", "\t"];
  const counts = new Map(candidates.map((delimiter) => [delimiter, 0]));
  let quoted = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') i += 1;
      else quoted = !quoted;
    } else if (!quoted && (char === "\n" || char === "\r")) break;
    else if (!quoted && counts.has(char as Exclude<CsvDiffDelimiter, "auto">)) {
      const delimiter = char as Exclude<CsvDiffDelimiter, "auto">;
      counts.set(delimiter, (counts.get(delimiter) ?? 0) + 1);
    }
  }
  return candidates.reduce((best, candidate) =>
    (counts.get(candidate) ?? 0) > (counts.get(best) ?? 0) ? candidate : best, ",");
}

function parseCsv(input: string, delimiter: Exclude<CsvDiffDelimiter, "auto">): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') { field += '"'; i += 1; }
        else { quoted = false; closedQuote = true; }
      } else field += char;
      continue;
    }
    if (closedQuote) {
      if (char === delimiter) { row.push(field); field = ""; closedQuote = false; }
      else if (char === "\n" || char === "\r") {
        row.push(field); rows.push(row); row = []; field = ""; closedQuote = false;
        if (char === "\r" && input[i + 1] === "\n") i += 1;
      } else throw new CsvDiffError("invalid");
      continue;
    }
    if (char === '"') {
      if (field.length) throw new CsvDiffError("invalid");
      quoted = true;
    } else if (char === delimiter) { row.push(field); field = ""; }
    else if (char === "\n" || char === "\r") {
      if (row.length || field.length) { row.push(field); rows.push(row); }
      row = []; field = "";
      if (char === "\r" && input[i + 1] === "\n") i += 1;
    } else field += char;
  }
  if (quoted) throw new CsvDiffError("invalid");
  if (field.length || row.length || closedQuote) { row.push(field); rows.push(row); }
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function parseDocument(input: string, delimiter: CsvDiffDelimiter): { headers: string[]; rows: Array<Record<string, string>> } {
  if (!input.trim()) throw new CsvDiffError("empty");
  if (input.length > CSV_DIFF_MAX_CHARS) throw new CsvDiffError("too-large");
  const selected = delimiter === "auto" ? detectDelimiter(input) : delimiter;
  const records = parseCsv(input.replace(/^\uFEFF/, ""), selected);
  if (records.length < 1 || records[0].length < 1) throw new CsvDiffError("empty");
  const headers = records[0].map((header) => header.trim());
  if (headers.some((header) => !header) || new Set(headers).size !== headers.length) throw new CsvDiffError("headers");
  if (records.length - 1 > CSV_DIFF_MAX_ROWS) throw new CsvDiffError("too-many-rows");
  const rows = records.slice(1).map((cells) => {
    if (cells.length !== headers.length) throw new CsvDiffError("invalid");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  });
  return { headers, rows };
}

export function getCsvDiffHeaders(input: string, delimiter: CsvDiffDelimiter = "auto"): string[] {
  if (!input.trim() || input.length > CSV_DIFF_MAX_CHARS) return [];
  try { return parseDocument(input, delimiter).headers; } catch { return []; }
}

export function compareCsvDocuments(
  beforeText: string,
  afterText: string,
  keyColumn = "",
  delimiter: CsvDiffDelimiter = "auto",
): CsvDiffResult {
  const before = parseDocument(beforeText, delimiter);
  const after = parseDocument(afterText, delimiter);
  if (keyColumn && (!before.headers.includes(keyColumn) || !after.headers.includes(keyColumn))) {
    throw new CsvDiffError("missing-key");
  }
  const columns = [...new Set([...before.headers, ...after.headers])];
  const beforeKeys = new Set<string>();
  const afterKeys = new Set<string>();
  const keyOf = (row: Record<string, string>, index: number) => keyColumn ? row[keyColumn] : String(index + 1);
  const beforeByKey = new Map<string, Record<string, string>>();
  const afterByKey = new Map<string, Record<string, string>>();
  before.rows.forEach((row, index) => {
    const key = keyOf(row, index);
    if (keyColumn && (!key.trim() || beforeKeys.has(key))) throw new CsvDiffError("duplicate-key");
    beforeKeys.add(key); beforeByKey.set(key, row);
  });
  after.rows.forEach((row, index) => {
    const key = keyOf(row, index);
    if (keyColumn && (!key.trim() || afterKeys.has(key))) throw new CsvDiffError("duplicate-key");
    afterKeys.add(key); afterByKey.set(key, row);
  });
  const keys = [...beforeByKey.keys(), ...[...afterByKey.keys()].filter((key) => !beforeByKey.has(key))];
  const changes: CsvDiffChange[] = [];
  let added = 0, removed = 0, changed = 0;
  for (const key of keys) {
    const oldRow = beforeByKey.get(key), newRow = afterByKey.get(key);
    if (!oldRow && newRow) {
      added += 1; changes.push({ kind: "added", key, fields: columns.filter((col) => col in newRow), after: newRow });
    } else if (oldRow && !newRow) {
      removed += 1; changes.push({ kind: "removed", key, fields: columns.filter((col) => col in oldRow), before: oldRow });
    } else if (oldRow && newRow) {
      const fields = columns.filter((col) => oldRow[col] !== newRow[col]);
      if (fields.length) { changed += 1; changes.push({ kind: "changed", key, fields, before: oldRow, after: newRow }); }
    }
    if (changes.length >= CSV_DIFF_MAX_CHANGES) break;
  }
  return { columns, keyColumn: keyColumn || null, changes, added, removed, changed, identical: changes.length === 0 };
}
