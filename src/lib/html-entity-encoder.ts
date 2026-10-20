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

// HTML numeric character references in the C1 control range use the
// Windows-1252 compatibility mappings defined by the HTML parsing algorithm.
const HTML_C1_REPLACEMENTS: Record<number, number> = {
  0x80: 0x20ac,
  0x82: 0x201a,
  0x83: 0x0192,
  0x84: 0x201e,
  0x85: 0x2026,
  0x86: 0x2020,
  0x87: 0x2021,
  0x88: 0x02c6,
  0x89: 0x2030,
  0x8a: 0x0160,
  0x8b: 0x2039,
  0x8c: 0x0152,
  0x8e: 0x017d,
  0x91: 0x2018,
  0x92: 0x2019,
  0x93: 0x201c,
  0x94: 0x201d,
  0x95: 0x2022,
  0x96: 0x2013,
  0x97: 0x2014,
  0x98: 0x02dc,
  0x99: 0x2122,
  0x9a: 0x0161,
  0x9b: 0x203a,
  0x9c: 0x0153,
  0x9e: 0x017e,
  0x9f: 0x0178,
};

export function encodeHtmlEntities(input: string): string {
  return input.replace(/[&<>"]/g, (character) => HTML_SPECIAL_ENTITIES[character] ?? character)
    .replace(/'/g, "&#39;");
}

function decodeNumericEntity(match: string, value: string): string {
  const codePoint = value.toLowerCase().startsWith("x")
    ? Number.parseInt(value.slice(1), 16)
    : Number.parseInt(value, 10);

  // HTML replaces a null character reference with U+FFFD instead of inserting U+0000.
  if (codePoint === 0) return "\uFFFD";

  if (
    !Number.isInteger(codePoint) ||
    codePoint < 0 ||
    codePoint > 0x10ffff ||
    (codePoint >= 0xd800 && codePoint <= 0xdfff)
  ) {
    return match;
  }

  return String.fromCodePoint(HTML_C1_REPLACEMENTS[codePoint] ?? codePoint);
}

export function decodeHtmlEntities(input: string): string {
  const namedDecoded = input.replace(NAMED_ENTITY_PATTERN, (_, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? _);
  return namedDecoded.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, decodeNumericEntity);
}

export function transformHtmlEntities(input: string, mode: "encode" | "decode"): string {
  return mode === "encode" ? encodeHtmlEntities(input) : decodeHtmlEntities(input);
}
