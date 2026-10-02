export type TextStats = {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  spaces: number;
  lines: number;
};

const wordPattern = /[\p{L}\p{N}\p{M}]+(?:['’\u2011-][\p{L}\p{N}\p{M}]+)*/gu;

function countGraphemes(text: string): number {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    try {
      return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)).length;
    } catch {
      // Fall back to code-point counting when grapheme segmentation is unavailable.
    }
  }
  return Array.from(text).length;
}

export function countTextStats(text: string): TextStats {
  const characters = countGraphemes(text);
  const charactersWithoutSpaces = countGraphemes(text.replace(/\s/gu, ""));
  const words = text.match(wordPattern)?.length ?? 0;
  const spaces = text.match(/[^\S\r\n]/gu)?.length ?? 0;
  const lines = text === "" ? 0 : text.split(/\r\n|\r|\n/gu).length;

  return { characters, charactersWithoutSpaces, words, spaces, lines };
}
