import type { CSSProperties } from "react";

export type SpacerProps = {
  className?: string;
  style?: CSSProperties;
};

/** Web adaptation of androidx.compose.foundation.layout.Spacer. */
export function Spacer({ className, style }: SpacerProps) {
  return <div aria-hidden="true" className={className} style={{ flex: "1 1 auto", ...style }} />;
}
