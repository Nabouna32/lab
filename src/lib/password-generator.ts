export const PASSWORD_LIMITS = {
  minLength: 8,
  maxLength: 128,
} as const;

export type PasswordOptions = {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

export type PasswordGeneratorError = "invalid-length" | "empty-character-set";

const CHARACTER_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;

const AMBIGUOUS = new Set(["O", "0", "I", "l", "1", "|"]);

export function generatePassword(
  options: PasswordOptions,
  randomUint32: () => number = createRandomUint32(),
): string {
  validateOptions(options);

  const alphabet = getAlphabet(options);
  if (!alphabet) throw new Error("empty-character-set");

  const requiredSets = getSelectedCharacterSets(options)
    .map((set) => options.excludeAmbiguous ? filterAmbiguous(set) : set)
    .filter(Boolean);

  if (requiredSets.length === 0) throw new Error("empty-character-set");

  const password = requiredSets.map((set) => set[randomIndex(set.length, randomUint32)]!);

  while (password.length < options.length) {
    password.push(alphabet[randomIndex(alphabet.length, randomUint32)]!);
  }

  for (let index = password.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1, randomUint32);
    [password[index], password[swapIndex]] = [password[swapIndex]!, password[index]!];
  }

  return password.join("");
}

export function getAlphabet(options: PasswordOptions): string {
  const sets = [
    options.lowercase ? CHARACTER_SETS.lowercase : "",
    options.uppercase ? CHARACTER_SETS.uppercase : "",
    options.numbers ? CHARACTER_SETS.numbers : "",
    options.symbols ? CHARACTER_SETS.symbols : "",
  ];

  const alphabet = [...new Set(sets.join(""))];
  return options.excludeAmbiguous
    ? alphabet.filter((character) => !AMBIGUOUS.has(character)).join("")
    : alphabet.join("");
}

function getSelectedCharacterSets(options: PasswordOptions): string[] {
  return [
    options.lowercase ? CHARACTER_SETS.lowercase : "",
    options.uppercase ? CHARACTER_SETS.uppercase : "",
    options.numbers ? CHARACTER_SETS.numbers : "",
    options.symbols ? CHARACTER_SETS.symbols : "",
  ].filter(Boolean);
}

function filterAmbiguous(set: string): string {
  return [...set].filter((character) => !AMBIGUOUS.has(character)).join("");
}

export function validateOptions(options: PasswordOptions): void {
  if (
    !Number.isInteger(options.length) ||
    options.length < PASSWORD_LIMITS.minLength ||
    options.length > PASSWORD_LIMITS.maxLength
  ) {
    throw new Error("invalid-length" satisfies PasswordGeneratorError);
  }

  if (!options.lowercase && !options.uppercase && !options.numbers && !options.symbols) {
    throw new Error("empty-character-set" satisfies PasswordGeneratorError);
  }

  const selectedSets = getSelectedCharacterSets(options);
  if (
    options.excludeAmbiguous &&
    selectedSets.some((set) => filterAmbiguous(set).length === 0)
  ) {
    throw new Error("empty-character-set" satisfies PasswordGeneratorError);
  }
}

function randomIndex(maxExclusive: number, randomUint32: () => number): number {
  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
  let value = randomUint32() >>> 0;
  while (value >= limit) value = randomUint32() >>> 0;
  return value % maxExclusive;
}

function createRandomUint32(): () => number {
  const buffer = new Uint32Array(1);
  return () => {
    globalThis.crypto.getRandomValues(buffer);
    return buffer[0]!;
  };
}
