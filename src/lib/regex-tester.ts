export type RegexMatch = {
  value: string;
  index: number;
  captures: string[];
  namedGroups: Record<string, string | undefined>;
};

export type RegexTestResult = {
  matches: RegexMatch[];
  truncated: boolean;
};

const MAX_PATTERN_LENGTH = 2_000;
const MAX_INPUT_LENGTH = 20_000;
const MAX_MATCHES = 200;

export function testRegex(pattern: string, flags: string, input: string): RegexTestResult {
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new Error(`The regular expression is limited to ${MAX_PATTERN_LENGTH} characters.`);
  }
  if (input.length > MAX_INPUT_LENGTH) {
    throw new Error(`The test text is limited to ${MAX_INPUT_LENGTH} characters.`);
  }

  const regex = new RegExp(pattern, flags);
  const matches: RegexMatch[] = [];

  if (regex.global) {
    for (const match of input.matchAll(regex)) {
      matches.push(toRegexMatch(match));
      if (matches.length >= MAX_MATCHES) {
        return { matches, truncated: true };
      }
    }
  } else {
    const match = regex.exec(input);
    if (match) matches.push(toRegexMatch(match));
  }

  return { matches, truncated: false };
}

function toRegexMatch(match: RegExpMatchArray): RegexMatch {
  return {
    value: match[0],
    index: match.index ?? 0,
    captures: match.slice(1),
    namedGroups: match.groups ? { ...match.groups } : {},
  };
}
