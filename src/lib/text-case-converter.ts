export const TEXT_CASES = [
  "uppercase",
  "lowercase",
  "title",
  "camel",
  "pascal",
  "snake",
  "kebab",
] as const;

export type TextCase = (typeof TEXT_CASES)[number];

function tokenize(value: string): string[] {
  return (
    value
      .trim()
      .replace(/([\p{Ll}\p{Lt}])(\p{Lu})/gu, "$1 $2")
      .replace(/([\p{Lu}]{2,})([\p{Lu}][\p{Ll}])/gu, "$1 $2")
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}

function capitalize(value: string): string {
  return value ? value[0].toLocaleUpperCase() + value.slice(1).toLocaleLowerCase() : value;
}

export function convertTextCase(input: string, format: TextCase): string {
  switch (format) {
    case "uppercase":
      return input.toLocaleUpperCase();
    case "lowercase":
      return input.toLocaleLowerCase();
    case "title":
      return tokenize(input).map(capitalize).join(" ");
    case "camel": {
      const words = tokenize(input).map((word) => word.toLocaleLowerCase());
      return words.map((word, index) => index === 0 ? word : capitalize(word)).join("");
    }
    case "pascal":
      return tokenize(input).map(capitalize).join("");
    case "snake":
      return tokenize(input).map((word) => word.toLocaleLowerCase()).join("_");
    case "kebab":
      return tokenize(input).map((word) => word.toLocaleLowerCase()).join("-");
  }
}
