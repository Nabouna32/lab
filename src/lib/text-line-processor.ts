export const TEXT_LINE_PROCESSOR_MAX_CHARS = 500_000;

export type TextLineSortOrder = "none" | "ascending" | "descending";

export type TextLineProcessorOptions = {
  trimLines: boolean;
  removeBlankLines: boolean;
  removeDuplicates: boolean;
  sortOrder: TextLineSortOrder;
};

export function processTextLines(
  input: string,
  options: TextLineProcessorOptions,
  locale: string,
): string {
  if (input.length > TEXT_LINE_PROCESSOR_MAX_CHARS) {
    throw new RangeError("Text exceeds the safe processing limit.");
  }
  if (!input) return "";

  let lines = input.split(/\r\n?|\n/);

  if (options.trimLines) {
    lines = lines.map((line) => line.trim());
  }
  if (options.removeBlankLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }
  if (options.removeDuplicates) {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      const key = line.toLocaleLowerCase(locale);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  if (options.sortOrder !== "none") {
    const direction = options.sortOrder === "ascending" ? 1 : -1;
    lines = [...lines].sort((left, right) => direction * left.localeCompare(right, locale, {
      sensitivity: "base",
      numeric: true,
    }));
  }

  return lines.join("\n");
}

export function countTextLines(value: string): number {
  if (value.length === 0) return 0;
  const lines = value.split(/\r\n?|\n/);
  if (lines.at(-1) === "") lines.pop();
  return lines.length;
}
