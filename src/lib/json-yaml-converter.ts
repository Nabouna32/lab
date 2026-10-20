import { parseDocument, stringify } from "yaml";

export const MAX_JSON_YAML_INPUT_LENGTH = 200_000;
export const MAX_JSON_YAML_ALIAS_COUNT = 100;

export type JsonYamlDirection = "yaml-to-json" | "json-to-yaml";
export type JsonYamlErrorKind = "empty" | "invalid" | "resource" | "unsupported";
export type JsonYamlConversionError = {
  kind: JsonYamlErrorKind;
  line: number;
  column: number;
  message: string;
};
export type JsonYamlConversionResult =
  | { ok: true; value: string }
  | { ok: false; error: JsonYamlConversionError };

type YamlParserError = {
  message?: string;
  linePos?: { start?: { line?: number; col?: number } };
};

function parserError(error: YamlParserError): JsonYamlConversionError {
  return {
    kind: "invalid",
    line: error.linePos?.start?.line ?? 1,
    column: error.linePos?.start?.col ?? 1,
    message: error.message ?? "Invalid YAML.",
  };
}

function jsonErrorPosition(error: SyntaxError, input: string): { line: number; column: number } {
  const position = error.message.match(/position\s+(\d+)/i)?.[1];
  const lineAndColumn = error.message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  let offset: number;

  if (position !== undefined) {
    offset = Number(position);
  } else if (lineAndColumn) {
    const targetLine = Number(lineAndColumn[1]);
    const targetColumn = Number(lineAndColumn[2]);
    const lines = input.split("\n");
    return { line: targetLine, column: Math.min(targetColumn, (lines[targetLine - 1]?.length ?? 0) + 1) };
  } else {
    // Some runtimes omit offsets from SyntaxError messages. Point to a common
    // missing-value location when possible; otherwise use the end of the input.
    const missingValue = /:\s*[}\]]/.exec(input);
    offset = missingValue ? missingValue.index + missingValue[0].length - 1 : Math.max(0, input.length - 1);
  }

  const beforeError = input.slice(0, offset);
  const lines = beforeError.split("\n");
  return { line: lines.length, column: lines.at(-1)!.length + 1 };
}

function assertJsonCompatible(value: unknown, ancestors = new WeakSet<object>()): void {
  if (value === null || typeof value === "string" || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (Number.isFinite(value)) return;
    throw new TypeError("Non-finite numbers cannot be represented in JSON.");
  }
  if (typeof value !== "object") {
    throw new TypeError("This YAML value cannot be represented in JSON without data loss.");
  }
  if (value instanceof Date || (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)) {
    throw new TypeError("This YAML value cannot be represented in JSON without data loss.");
  }
  if (ancestors.has(value)) {
    throw new TypeError("Circular YAML aliases cannot be represented in JSON.");
  }
  ancestors.add(value);
  if (Array.isArray(value)) {
    for (const item of value) assertJsonCompatible(item, ancestors);
  } else {
    for (const item of Object.values(value as Record<string, unknown>)) assertJsonCompatible(item, ancestors);
  }
  ancestors.delete(value);
}

export function convertJsonYaml(
  input: string,
  direction: JsonYamlDirection,
  indent: number = 2,
): JsonYamlConversionResult {
  if (!input.trim()) {
    return { ok: false, error: { kind: "empty", line: 1, column: 1, message: "Input is empty." } };
  }
  if (input.length > MAX_JSON_YAML_INPUT_LENGTH) {
    return { ok: false, error: { kind: "resource", line: 1, column: 1, message: "Input exceeds the safe size limit." } };
  }
  if (![2, 4].includes(indent)) throw new RangeError("Indentation must be 2 or 4 spaces.");

  if (direction === "json-to-yaml") {
    let value: unknown;
    try {
      value = JSON.parse(input);
    } catch (error) {
      const position = error instanceof SyntaxError ? jsonErrorPosition(error, input) : { line: 1, column: 1 };
      return {
        ok: false,
        error: {
          kind: "invalid",
          ...position,
          message: error instanceof Error ? error.message : "Invalid JSON.",
        },
      };
    }

    try {
      return { ok: true, value: stringify(value, { indent, lineWidth: 0 }) };
    } catch (error) {
      return {
        ok: false,
        error: {
          kind: "resource",
          line: 1,
          column: 1,
          message: error instanceof Error ? error.message : "JSON could not be converted safely.",
        },
      };
    }
  }

  try {
    const document = parseDocument(input, { version: "1.2", strict: true, uniqueKeys: true });
    const firstError = document.errors[0] as YamlParserError | undefined;
    if (firstError) return { ok: false, error: parserError(firstError) };

    const value = document.toJS({ maxAliasCount: MAX_JSON_YAML_ALIAS_COUNT }) ?? null;
    assertJsonCompatible(value);
    return { ok: true, value: JSON.stringify(value, null, 2) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "YAML could not be converted safely.";
    const kind = /alias|too deeply|maximum|resource|circular/i.test(message) ? "resource" : /cannot be represented in JSON|data loss/i.test(message) ? "unsupported" : "invalid";
    return {
      ok: false,
      error: {
        kind,
        line: 1,
        column: 1,
        message,
      },
    };
  }
}
