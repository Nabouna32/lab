export type JsonPathErrorCode = "invalid-path" | "not-found" | "invalid-json";

export class JsonPathError extends Error {
  readonly code: JsonPathErrorCode;

  constructor(code: JsonPathErrorCode) {
    super(code);
    this.name = "JsonPathError";
    this.code = code;
  }
}

type Segment = string | number;

function parsePath(path: string): Segment[] {
  const source = path.trim();
  if (!source.startsWith("$")) throw new JsonPathError("invalid-path");
  const segments: Segment[] = [];
  let index = 1;

  while (index < source.length) {
    if (source[index] === ".") {
      index += 1;
      const start = index;
      while (index < source.length && source[index] !== "." && source[index] !== "[") index += 1;
      const key = source.slice(start, index);
      if (!key || /[\s\]]/.test(key)) throw new JsonPathError("invalid-path");
      segments.push(key);
      continue;
    }

    if (source[index] !== "[") throw new JsonPathError("invalid-path");
    index += 1;
    if (index >= source.length) throw new JsonPathError("invalid-path");

    const quote = source[index];
    if (quote === "'" || quote === '"') {
      index += 1;
      let key = "";
      let closed = false;
      while (index < source.length) {
        const char = source[index];
        if (char === "\\") {
          index += 1;
          if (index >= source.length) throw new JsonPathError("invalid-path");
          key += source[index];
          index += 1;
        } else if (char === quote) {
          closed = true;
          index += 1;
          break;
        } else {
          key += char;
          index += 1;
        }
      }
      if (!closed || source[index] !== "]") throw new JsonPathError("invalid-path");
      index += 1;
      segments.push(key);
      continue;
    }

    const start = index;
    while (index < source.length && /[0-9]/.test(source[index])) index += 1;
    const number = source.slice(start, index);
    if (!number || source[index] !== "]") throw new JsonPathError("invalid-path");
    index += 1;
    const parsed = Number(number);
    if (!Number.isSafeInteger(parsed)) throw new JsonPathError("invalid-path");
    segments.push(parsed);
  }

  return segments;
}

export function extractJsonPath(jsonText: string, path: string): unknown {
  let root: unknown;
  try {
    root = JSON.parse(jsonText);
  } catch {
    throw new JsonPathError("invalid-json");
  }

  const segments = parsePath(path);
  let current = root;
  for (const segment of segments) {
    if (typeof segment === "number") {
      if (!Array.isArray(current) || segment >= current.length) throw new JsonPathError("not-found");
      current = current[segment];
      continue;
    }
    if (current === null || typeof current !== "object" || !Object.prototype.hasOwnProperty.call(current, segment)) {
      throw new JsonPathError("not-found");
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}
