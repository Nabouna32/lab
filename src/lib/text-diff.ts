export type DiffLineType = "equal" | "added" | "removed";

export type DiffLine = {
  type: DiffLineType;
  text: string;
  oldLine?: number;
  newLine?: number;
};

export type DiffResult = {
  lines: DiffLine[];
  added: number;
  removed: number;
  unchanged: number;
};

export const MAX_DIFF_LINES = 1500;

export function splitLines(value: string): string[] {
  if (value === "") return [];
  return value.replace(/\r\n?/g, "\n").split("\n");
}

export function diffText(left: string, right: string): DiffResult {
  const a = splitLines(left);
  const b = splitLines(right);

  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) {
    throw new RangeError("Each text input must contain at most " + MAX_DIFF_LINES + " lines.");
  }

  const columns = b.length + 1;
  const table = new Uint32Array((a.length + 1) * columns);

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * columns + j] =
        a[i] === b[j]
          ? table[(i + 1) * columns + j + 1] + 1
          : Math.max(table[(i + 1) * columns + j], table[i * columns + j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      lines.push({ type: "equal", text: a[i], oldLine: i + 1, newLine: j + 1 });
      i += 1;
      j += 1;
      continue;
    }

    const down = i < a.length ? table[(i + 1) * columns + j] : -1;
    const right = j < b.length ? table[i * columns + j + 1] : -1;

    if (j < b.length && (i === a.length || right > down)) {
      lines.push({ type: "added", text: b[j], newLine: j + 1 });
      j += 1;
    } else {
      lines.push({ type: "removed", text: a[i], oldLine: i + 1 });
      i += 1;
    }
  }

  return {
    lines,
    added: lines.filter((line) => line.type === "added").length,
    removed: lines.filter((line) => line.type === "removed").length,
    unchanged: lines.filter((line) => line.type === "equal").length,
  };
}
