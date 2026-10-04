import { parseDocument } from "yaml";

export const MAX_YAML_INPUT_LENGTH = 200_000;
export const MAX_YAML_ALIAS_COUNT = 100;

export type YamlFormatErrorKind = "empty" | "invalid" | "resource";

export type YamlFormatError = {
  kind: YamlFormatErrorKind;
  line: number;
  column: number;
  message: string;
};

export type YamlFormatResult =
  | { ok: true; formatted: string }
  | { ok: false; error: YamlFormatError };

type YamlDocumentError = {
  message?: string;
  linePos?: { start?: { line?: number; col?: number } };
};

function errorFromDocument(error: YamlDocumentError): YamlFormatError {
  return {
    kind: "invalid",
    line: error.linePos?.start?.line ?? 1,
    column: error.linePos?.start?.col ?? 1,
    message: error.message ?? "Invalid YAML",
  };
}

export function formatYaml(input: string, indent: number): YamlFormatResult {
  if (!input.trim()) {
    return {
      ok: false,
      error: { kind: "empty", line: 1, column: 1, message: "YAML input is empty." },
    };
  }

  if (input.length > MAX_YAML_INPUT_LENGTH) {
    return {
      ok: false,
      error: {
        kind: "resource",
        line: 1,
        column: 1,
        message: "YAML input exceeds the safe size limit.",
      },
    };
  }

  if (![2, 4].includes(indent)) {
    throw new RangeError("YAML indentation must be 2 or 4 spaces.");
  }

  try {
    const document = parseDocument(input, { version: "1.2", strict: true });
    const firstError = document.errors[0] as YamlDocumentError | undefined;

    if (firstError) {
      return { ok: false, error: errorFromDocument(firstError) };
    }

    document.toJS({ maxAliasCount: MAX_YAML_ALIAS_COUNT });

    return {
      ok: true,
      formatted: document
        .toString({
          indent,
          indentSeq: true,
          lineWidth: 0,
          verifyAliasOrder: true,
        })
        .trimEnd(),
    };
  } catch (error) {
    return {
      ok: false,
      error: {
        kind: "resource",
        line: 1,
        column: 1,
        message: error instanceof Error ? error.message : "YAML could not be processed safely.",
      },
    };
  }
}

export function getYamlFormatError(input: string): YamlFormatError | null {
  const result = formatYaml(input, 2);
  return result.ok ? null : result.error;
}
