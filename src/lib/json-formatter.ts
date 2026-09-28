export type JsonFormatOptions = { indent: string };

export type JsonFormatError = { index: number; line: number; column: number };

type JsonNode =
  | { kind: "primitive"; raw: string }
  | { kind: "object"; entries: Array<{ key: string; value: JsonNode }> }
  | { kind: "array"; items: JsonNode[] };

class JsonParseError extends Error {
  constructor(public readonly index: number) {
    super("Invalid JSON");
  }
}

class JsonParser {
  private index = 0;

  constructor(private readonly input: string) {}

  parse(): JsonNode {
    this.skipWhitespace();
    const value = this.parseValue(0);
    this.skipWhitespace();
    if (this.index !== this.input.length) throw new JsonParseError(this.index);
    return value;
  }

  private parseValue(depth: number): JsonNode {
    if (depth > 200) throw new JsonParseError(this.index);
    const char = this.input[this.index];
    if (char === "{") return this.parseObject(depth + 1);
    if (char === "[") return this.parseArray(depth + 1);
    if (char === '"') return { kind: "primitive", raw: this.parseString() };
    if (char === "t" && this.input.startsWith("true", this.index)) {
      this.index += 4;
      return { kind: "primitive", raw: "true" };
    }
    if (char === "f" && this.input.startsWith("false", this.index)) {
      this.index += 5;
      return { kind: "primitive", raw: "false" };
    }
    if (char === "n" && this.input.startsWith("null", this.index)) {
      this.index += 4;
      return { kind: "primitive", raw: "null" };
    }
    if (char !== undefined && "-0123456789".includes(char)) {
      return { kind: "primitive", raw: this.parseNumber() };
    }
    throw new JsonParseError(this.index);
  }

  private parseObject(depth: number): JsonNode {
    this.index += 1;
    this.skipWhitespace();
    const entries: Array<{ key: string; value: JsonNode }> = [];
    if (this.input[this.index] === "}") {
      this.index += 1;
      return { kind: "object", entries };
    }

    while (this.index < this.input.length) {
      if (this.input[this.index] !== '"') throw new JsonParseError(this.index);
      const key = this.parseString();
      this.skipWhitespace();
      if (this.input[this.index] !== ":") throw new JsonParseError(this.index);
      this.index += 1;
      this.skipWhitespace();
      entries.push({ key, value: this.parseValue(depth) });
      this.skipWhitespace();

      if (this.input[this.index] === "}") {
        this.index += 1;
        return { kind: "object", entries };
      }
      if (this.input[this.index] !== ",") throw new JsonParseError(this.index);
      this.index += 1;
      this.skipWhitespace();
      if (this.input[this.index] === "}") throw new JsonParseError(this.index);
    }

    throw new JsonParseError(this.index);
  }

  private parseArray(depth: number): JsonNode {
    this.index += 1;
    this.skipWhitespace();
    const items: JsonNode[] = [];
    if (this.input[this.index] === "]") {
      this.index += 1;
      return { kind: "array", items };
    }

    while (this.index < this.input.length) {
      items.push(this.parseValue(depth));
      this.skipWhitespace();
      if (this.input[this.index] === "]") {
        this.index += 1;
        return { kind: "array", items };
      }
      if (this.input[this.index] !== ",") throw new JsonParseError(this.index);
      this.index += 1;
      this.skipWhitespace();
      if (this.input[this.index] === "]") throw new JsonParseError(this.index);
    }

    throw new JsonParseError(this.index);
  }

  private parseString(): string {
    const start = this.index;
    this.index += 1;

    while (this.index < this.input.length) {
      const char = this.input[this.index];
      if (char === "\\") {
        this.index += 2;
        continue;
      }
      if (char === '"') {
        this.index += 1;
        const raw = this.input.slice(start, this.index);
        try {
          JSON.parse(raw);
        } catch {
          throw new JsonParseError(start);
        }
        return raw;
      }
      if (char < " ") throw new JsonParseError(this.index);
      this.index += 1;
    }

    throw new JsonParseError(start);
  }

  private parseNumber(): string {
    const start = this.index;
    if (this.input[this.index] === "-") this.index += 1;

    if (this.input[this.index] === "0") {
      this.index += 1;
    } else if (this.input[this.index] && /[1-9]/.test(this.input[this.index])) {
      while (this.input[this.index] && /[0-9]/.test(this.input[this.index])) this.index += 1;
    } else {
      throw new JsonParseError(this.index);
    }

    if (this.input[this.index] === ".") {
      this.index += 1;
      const fractionStart = this.index;
      while (this.input[this.index] && /[0-9]/.test(this.input[this.index])) this.index += 1;
      if (fractionStart === this.index) throw new JsonParseError(this.index);
    }

    if (this.input[this.index] === "e" || this.input[this.index] === "E") {
      this.index += 1;
      if (this.input[this.index] === "+" || this.input[this.index] === "-") this.index += 1;
      const exponentStart = this.index;
      while (this.input[this.index] && /[0-9]/.test(this.input[this.index])) this.index += 1;
      if (exponentStart === this.index) throw new JsonParseError(this.index);
    }

    return this.input.slice(start, this.index);
  }

  private skipWhitespace() {
    while (this.index < this.input.length && /[\t\n\r ]/.test(this.input[this.index])) this.index += 1;
  }
}

function render(node: JsonNode, indent: string, depth: number): string {
  if (node.kind === "primitive") return node.raw;

  const padding = indent.repeat(depth);
  const childPadding = indent.repeat(depth + 1);

  if (node.kind === "array") {
    if (node.items.length === 0) return "[]";
    return "[\n" + node.items.map((item) => childPadding + render(item, indent, depth + 1)).join(",\n") + "\n" + padding + "]";
  }

  if (node.entries.length === 0) return "{}";
  return "{\n" + node.entries.map((entry) => childPadding + entry.key + ": " + render(entry.value, indent, depth + 1)).join(",\n") + "\n" + padding + "}";
}

export function formatJson(input: string, options: JsonFormatOptions): string {
  return render(new JsonParser(input).parse(), options.indent, 0);
}

export function minifyJson(input: string): string {
  return render(new JsonParser(input).parse(), "", 0);
}

export function getJsonFormatError(input: string): JsonFormatError {
  try {
    new JsonParser(input).parse();
    return { index: -1, line: 0, column: 0 };
  } catch (error) {
    const index = error instanceof JsonParseError ? error.index : 0;
    const before = input.slice(0, index);
    const line = before.split("\n").length;
    const lastNewline = before.lastIndexOf("\n");
    return { index, line, column: index - lastNewline };
  }
}
