import { Hct, SchemeRainbow, argbFromHex, hexFromArgb } from "@material/material-color-utilities";
import type { CSSProperties } from "react";

const source = Hct.fromInt(argbFromHex("#6750A4"));
const lightScheme = new SchemeRainbow(source, false, 0, "2021", "phone");
const darkScheme = new SchemeRainbow(source, true, 0, "2021", "phone");

function toHex(argb: number): string {
  return hexFromArgb(argb).toLowerCase();
}

/**
 * Provides MCU-generated Rainbow tonal containers for the homepage frame.
 * Both themes are included so the same server-rendered markup follows the
 * active theme without client-side color calculation or hydration differences.
 */
export function getRainbowFrameStyle(): CSSProperties {
  return {
    "--home-rainbow-primary-light": toHex(lightScheme.primaryContainer),
    "--home-rainbow-secondary-light": toHex(lightScheme.secondaryContainer),
    "--home-rainbow-tertiary-light": toHex(lightScheme.tertiaryContainer),
    "--home-rainbow-primary-dark": toHex(darkScheme.primaryContainer),
    "--home-rainbow-secondary-dark": toHex(darkScheme.secondaryContainer),
    "--home-rainbow-tertiary-dark": toHex(darkScheme.tertiaryContainer),
  } as CSSProperties;
}
