export type CsvJsonOperation = "csv-to-json" | "json-to-csv";
export type CsvDelimiter = "," | ";" | "\t";

export type CsvJsonResult = {
  value: string | null;
  error: "invalid-csv" | "invalid-json" | "unsupported-json" | null;
};

function parseCsv(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];

    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          quoted = false;
          closedQuote = true;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (closedQuote) {
      if (char === delimiter) {
        row.push(field);
        field = "";
        closedQuote = false;
      } else if (char === "\n" || char === "\r") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        closedQuote = false;
        if (char === "\r" && input[i + 1] === "\n") i += 1;
      } else {
        throw new Error("invalid-csv");
      }
      continue;
    }

    if (char === '"') {
      if (field.length !== 0) throw new Error("invalid-csv");
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      if (input[i + 1] === "\n") i += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (quoted) throw new Error("invalid-csv");
  row.push(field);
  if (row.length > 1 || row[0] !== "" || rows.length === 0) rows.push(row);
  return rows;
}

function detectDelimiter(input: string): CsvDelimiter {
  const firstLine = input.split(/\r?\n/, 1)[0] ?? "";
  const candidates: CsvDelimiter[] = [",", ";", "\t"];
  return candidates.reduce((best, candidate) =>
    firstLine.split(candidate).length > firstLine.split(best).length ? candidate : best,
  ",");
}

function csvEscape(value: unknown, delimiter: CsvDelimiter): string {
  const text = value === null || value === undefined
    ? ""
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
  return /["\r\n]/.test(text) || text.includes(delimiter)
    ? `"${text.replaceAll('"', '""')}"`
    : text;
}

function toJson(input: string, delimiter: CsvDelimiter): CsvJsonResult {
  try {
    const rows = parseCsv(input, delimiter);
    if (rows.length === 0 || rows[0].every((cell) => cell === "")) {
      return { value: "[]", error: null };
    }

    const headers = rows[0];
    if (headers.some((header) => header === "") || new Set(headers).size !== headers.length) {
      return { value: null, error: "invalid-csv" };
    }

    const records = rows.slice(1).filter((row) => row.some((cell) => cell !== ""));
    const result = records.map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? "";
      });
      return record;
    });

    return { value: JSON.stringify(result, null, 2), error: null };
  } catch {
    return { value: null, error: "invalid-csv" };
  }
}

function fromJson(input: string, delimiter: CsvDelimiter): CsvJsonResult {
  try {
    const parsed: unknown = JSON.parse(input);
    if (!Array.isArray(parsed) || parsed.some((item) => item === null || typeof item !== "object" || Array.isArray(item))) {
      return { value: null, error: "unsupported-json" };
    }

    const records = parsed as Record<string, unknown>[];
    const headers = [...new Set(records.flatMap((record) => Object.keys(record)))];
    if (headers.length === 0) return { value: "", error: null };

    const lines = [headers.map((header) => csvEscape(header, delimiter)).join(delimiter)];
    for (const record of records) {
      lines.push(headers.map((header) => csvEscape(record[header], delimiter)).join(delimiter));
    }

    return { value: lines.join("\r\n"), error: null };
  } catch {
    return { value: null, error: "invalid-json" };
  }
}

export function transformCsvJson(
  input: string,
  operation: CsvJsonOperation,
  delimiter: CsvDelimiter = ",",
): CsvJsonResult {
  if (!input.trim()) return { value: "", error: null };
  return operation === "csv-to-json" ? toJson(input, delimiter === "," ? detectDelimiter(input) : delimiter) : fromJson(input, delimiter);
}
