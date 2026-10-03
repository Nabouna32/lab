const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  copy: "©",
  reg: "®",
  trade: "™",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
  euro: "€",
  cent: "¢",
  pound: "£",
  yen: "¥",
  plusmn: "±",
  times: "×",
  divide: "÷",
  middot: "·",
  bull: "•",
};

const HTML_SPECIAL_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const NAMED_ENTITY_PATTERN = new RegExp(
  `&(${Object.keys(NAMED_ENTITIES).join("|")});`,
  "gi",
);

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"]/g, (character) => HTML_SPECIAL_ENTITIES[character] ?? character)
    .replace(/'/g, "&#39;");
}

function decodeNumericEntity(match: string, value: string): string {
  const codePoint = value.toLowerCase().startsWith("x")
    ? Number.parseInt(value.slice(1), 16)
    : Number.parseInt(value, 10);

  if (
    !Number.isInteger(codePoint) ||
    codePoint < 0 ||
    codePoint > 0x10ffff ||
    (codePoint >= 0xd800 && codePoint <= 0xdfff)
  ) {
    return match;
  }

  return String.fromCodePoint(codePoint);
}

export function decodeHtmlEntities(input: string): string {
  const namedDecoded = input.replace(NAMED_ENTITY_PATTERN, (_, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? _);
  return namedDecoded.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, decodeNumericEntity);
}

export function transformHtmlEntities(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
}
