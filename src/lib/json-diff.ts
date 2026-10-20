export type JsonDiffKind = "added" | "removed" | "changed";
export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };
export type JsonDiffChange = { path: string; kind: JsonDiffKind; before?: JsonValue; after?: JsonValue };
export type JsonDiffResult = { changes: JsonDiffChange[]; identical: boolean; truncated: boolean };
export type JsonDiffErrorCode = "invalid-json" | "input-too-large" | "depth-limit";

export class JsonDiffError extends Error {
  readonly code: JsonDiffErrorCode;

  constructor(code: JsonDiffErrorCode) {
    super(code);
    this.code = code;
    this.name = "JsonDiffError";
  }
}

const MAX_INPUT_LENGTH = 200_000;
const MAX_DEPTH = 80;
const MAX_CHANGES = 500;

function parseDocument(input: string): JsonValue {
  try {
    return JSON.parse(input) as JsonValue;
  } catch {
    throw new JsonDiffError("invalid-json");
  }
}

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function pathForKey(path: string, key: string): string {
  return path + "[" + JSON.stringify(key) + "]";
}

/** Compare JSON semantically while bounding input size, depth and output. */
export function compareJsonDocuments(leftText: string, rightText: string): JsonDiffResult {
  if (leftText.length > MAX_INPUT_LENGTH || rightText.length > MAX_INPUT_LENGTH) {
    throw new JsonDiffError("input-too-large");
  }

  const left = parseDocument(leftText);
  const right = parseDocument(rightText);
  const changes: JsonDiffChange[] = [];
  let truncated = false;

  function record(change: JsonDiffChange): void {
    if (changes.length < MAX_CHANGES) changes.push(change);
    else truncated = true;
  }

  function visit(before: JsonValue, after: JsonValue, path: string, depth: number): void {
    if (truncated) return;
    if (depth > MAX_DEPTH) throw new JsonDiffError("depth-limit");
    if (Object.is(before, after)) return;

    if (Array.isArray(before) && Array.isArray(after)) {
      const commonLength = Math.min(before.length, after.length);
      for (let index = 0; index < commonLength; index += 1) {
        visit(before[index], after[index], path + "[" + index + "]", depth + 1);
        if (truncated) return;
      }
      for (let index = commonLength; index < before.length; index += 1) {
        record({ path: path + "[" + index + "]", kind: "removed", before: before[index] });
        if (truncated) return;
      }
      for (let index = commonLength; index < after.length; index += 1) {
        record({ path: path + "[" + index + "]", kind: "added", after: after[index] });
        if (truncated) return;
      }
      return;
    }

    if (isRecord(before) && isRecord(after)) {
      const beforeKeys = Object.keys(before).sort();
      const afterKeys = Object.keys(after).sort();
      const afterKeySet = new Set(afterKeys);
      const beforeKeySet = new Set(beforeKeys);

      for (const key of beforeKeys) {
        if (!afterKeySet.has(key)) {
          record({ path: pathForKey(path, key), kind: "removed", before: before[key] });
        } else {
          visit(before[key], after[key], pathForKey(path, key), depth + 1);
        }
        if (truncated) return;
      }

      for (const key of afterKeys) {
        if (!beforeKeySet.has(key)) record({ path: pathForKey(path, key), kind: "added", after: after[key] });
        if (truncated) return;
      }
      return;
    }

    record({ path, kind: "changed", before, after });
  }

  visit(left, right, "$", 0);
  return { changes, identical: changes.length === 0, truncated };
}
