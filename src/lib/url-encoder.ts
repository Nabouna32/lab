export type UrlTransformOperation = "encode" | "decode";
export type UrlTransformScope = "component" | "uri";

export type UrlTransformResult =
  | { value: string; error: null }
  | { value: null; error: "invalid-encoding" | "invalid-text" };

export function transformUrlText(
  input: string,
  operation: UrlTransformOperation,
  scope: UrlTransformScope,
): UrlTransformResult {
  try {
    if (operation === "encode") {
      const value = scope === "component" ? encodeURIComponent(input) : encodeURI(input);
      return { value, error: null };
    }

    const value = scope === "component" ? decodeURIComponent(input) : decodeURI(input);
    return { value, error: null };
  } catch (error) {
    if (error instanceof URIError) {
      return {
        value: null,
        error: operation === "decode" ? "invalid-encoding" : "invalid-text",
      };
    }
    throw error;
  }
}
