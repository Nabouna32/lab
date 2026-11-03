"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";
import styles from "./Scaffold.module.css";

export const FabPosition = {
  Start: "start",
  Center: "center",
  End: "end",
  EndOverlay: "end-overlay",
} as const;

export type ScaffoldFabPosition = (typeof FabPosition)[keyof typeof FabPosition];

export const ScaffoldDefaults = {
  contentWindowInsets: {
    top: "env(safe-area-inset-top, 0px)",
    right: "env(safe-area-inset-right, 0px)",
    bottom: "env(safe-area-inset-bottom, 0px)",
    left: "env(safe-area-inset-left, 0px)",
  },
} as const;

export type ScaffoldInsets = {
  top: string | number;
  right: string | number;
  bottom: string | number;
  left: string | number;
};

export type ScaffoldPaddingValues = {
  top: string;
  bottom: string;
  start: string;
  end: string;
};

type ElementSize = { width: number; height: number };

function useElementSize<T extends HTMLElement>(
  enabled: boolean,
): [RefObject<T | null>, ElementSize] {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize((current) =>
        current.width === rect.width && current.height === rect.height
          ? current
          : { width: rect.width, height: rect.height },
      );
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return [ref, size];
}

function cssLength(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

export type ScaffoldProps = {
  children: (padding: ScaffoldPaddingValues) => ReactNode;
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  snackbarHost?: ReactNode;
  floatingActionButton?: ReactNode;
  floatingActionButtonPosition?: ScaffoldFabPosition;
  containerColor?: string;
  contentColor?: string;
  contentWindowInsets?: Partial<ScaffoldInsets>;
  className?: string;
  style?: CSSProperties;
};

/**
 * Partial React/Web port of AndroidX Material 3 1.4.0 Scaffold.
 * The content render prop receives the measured bar padding and safe-area insets.
 * Snackbar state/queue ownership remains the responsibility of the supplied host.
 */
export function Scaffold({
  children,
  topBar,
  bottomBar,
  snackbarHost,
  floatingActionButton,
  floatingActionButtonPosition = "end",
  containerColor = "var(--surface)",
  contentColor = "var(--on-surface)",
  contentWindowInsets,
  className = "",
  style,
}: ScaffoldProps) {
  const hasTopBar = topBar != null;
  const hasBottomBar = bottomBar != null;
  const hasSnackbar = snackbarHost != null;
  const hasFab = floatingActionButton != null;

  const [topBarRef, topBarSize] = useElementSize<HTMLDivElement>(hasTopBar);
  const [bottomBarRef, bottomBarSize] = useElementSize<HTMLDivElement>(hasBottomBar);
  const [fabRef, fabSize] = useElementSize<HTMLDivElement>(hasFab);

  const insets = {
    top: cssLength(contentWindowInsets?.top ?? ScaffoldDefaults.contentWindowInsets.top),
    right: cssLength(contentWindowInsets?.right ?? ScaffoldDefaults.contentWindowInsets.right),
    bottom: cssLength(contentWindowInsets?.bottom ?? ScaffoldDefaults.contentWindowInsets.bottom),
    left: cssLength(contentWindowInsets?.left ?? ScaffoldDefaults.contentWindowInsets.left),
  };

  const padding: ScaffoldPaddingValues = {
    top: hasTopBar && (topBarSize.width > 0 || topBarSize.height > 0) ? `${topBarSize.height}px` : insets.top,
    bottom: hasBottomBar && (bottomBarSize.width > 0 || bottomBarSize.height > 0) ? `${bottomBarSize.height}px` : insets.bottom,
    start: "var(--scaffold-inset-start)",
    end: "var(--scaffold-inset-end)",
  };

  const fabAnchor =
    hasBottomBar && bottomBarSize.height > 0 && floatingActionButtonPosition !== "end-overlay"
      ? `${bottomBarSize.height}px`
      : insets.bottom;
  const fabBottom = `calc(16px + ${fabAnchor})`;
  const fabTopOffset = `calc(${fabSize.height}px + 16px + ${fabAnchor})`;
  const hasMeasuredFab = hasFab && fabSize.width > 0 && fabSize.height > 0;
  const snackbarAnchor = hasMeasuredFab
    ? fabTopOffset
    : hasBottomBar && bottomBarSize.height > 0
      ? `${bottomBarSize.height}px`
      : insets.bottom;
  const snackbarBottom = snackbarAnchor;

  const fabPositionStyle: CSSProperties =
    floatingActionButtonPosition === "start"
      ? { insetInlineStart: "calc(var(--scaffold-inset-start) + 16px)" }
      : floatingActionButtonPosition === "center"
        ? {
            left: "calc((100% - var(--scaffold-fab-width) + var(--scaffold-inset-left) - var(--scaffold-inset-right)) / 2)",
          }
        : { insetInlineEnd: "calc(var(--scaffold-inset-end) + 16px)" };

  const rootStyle = {
    ...style,
    backgroundColor: containerColor,
    color: contentColor,
    "--scaffold-inset-left": insets.left,
    "--scaffold-inset-right": insets.right,
    "--scaffold-fab-width": `${fabSize.width}px`,
  } as CSSProperties;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} style={rootStyle} data-component="scaffold">
      <div className={styles.content} data-slot="content">
        {children(padding)}
      </div>
      {hasTopBar && <div ref={topBarRef} className={styles.topBar} data-slot="top-bar">{topBar}</div>}
      {hasBottomBar && <div ref={bottomBarRef} className={styles.bottomBar} data-slot="bottom-bar">{bottomBar}</div>}
      {hasFab && (
        <div
          ref={fabRef}
          className={styles.fab}
          data-slot="floating-action-button"
          data-position={floatingActionButtonPosition}
          style={{ ...fabPositionStyle, insetBlockEnd: fabBottom }}
        >
          {floatingActionButton}
        </div>
      )}
      {hasSnackbar && (
        <div
          className={styles.snackbar}
          data-slot="snackbar-host"
          style={{ insetBlockEnd: snackbarBottom }}
        >
          {snackbarHost}
        </div>
      )}
    </div>
  );
}
