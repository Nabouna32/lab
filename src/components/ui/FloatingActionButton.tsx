"use client";

import type { ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from "react";
import styles from "./FloatingActionButton.module.css";

export type FloatingActionButtonElevation = Readonly<{
  defaultElevation: number;
  pressedElevation: number;
  focusedElevation: number;
  hoveredElevation: number;
}>;

type ElevationOverrides = Partial<FloatingActionButtonElevation>;

function createElevation(defaults: FloatingActionButtonElevation, overrides: ElevationOverrides = {}) {
  return { ...defaults, ...overrides };
}

export const FloatingActionButtonDefaults = {
  LargeIconSize: 36,
  shape: "var(--shape-corner-large, 16px)",
  smallShape: "var(--shape-corner-medium, 12px)",
  largeShape: "var(--shape-corner-extra-large, 28px)",
  extendedFabShape: "var(--shape-corner-large, 16px)",
  containerColor: "var(--primary-container, #d3e3fd)",
  contentColor: "var(--on-primary-container, #041e49)",
  elevation: (overrides: ElevationOverrides = {}) =>
    createElevation(
      { defaultElevation: 6, pressedElevation: 6, focusedElevation: 6, hoveredElevation: 8 },
      overrides,
    ),
  loweredElevation: (overrides: ElevationOverrides = {}) =>
    createElevation(
      { defaultElevation: 1, pressedElevation: 1, focusedElevation: 1, hoveredElevation: 3 },
      overrides,
    ),
  bottomAppBarFabElevation: (overrides: ElevationOverrides = {}) =>
    createElevation(
      { defaultElevation: 0, pressedElevation: 0, focusedElevation: 0, hoveredElevation: 0 },
      overrides,
    ),
};

type CommonFabProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onClick" | "style" | "className" | "aria-label"
> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  containerColor?: string;
  contentColor?: string;
  shape?: string;
  elevation?: FloatingActionButtonElevation;
  className?: string;
  style?: CSSProperties;
};

type StandardFabProps = CommonFabProps & { children: ReactNode };

type ExtendedFabWithIconProps = CommonFabProps &
  (
    | { text: ReactNode; icon: ReactNode; expanded?: true; children?: never }
    | { text: ReactNode; icon: ReactNode; expanded: false; "aria-label": string; children?: never }
  );

type ExtendedFabContentProps = CommonFabProps & {
  children: ReactNode;
  text?: never;
  icon?: never;
  expanded?: never;
};

type InternalFabVariant = "default" | "small" | "large" | "extended" | "extendedContent";

type InternalFabProps = CommonFabProps & {
  variant: InternalFabVariant;
  children: ReactNode;
};

function elevationShadow(value: number): string {
  if (value <= 0) return "none";
  const firstOffset = Math.max(1, Math.round(value * 0.5 * 100) / 100);
  const firstBlur = Math.max(2, Math.round(value * 1.5 * 100) / 100);
  const secondBlur = Math.max(1, Math.round(value * 0.5 * 100) / 100);
  return `0 ${firstOffset}px ${firstBlur}px rgb(0 0 0 / 0.18), 0 1px ${secondBlur}px rgb(0 0 0 / 0.14)`;
}

function FabButton({
  variant,
  onClick,
  type = "button",
  containerColor = FloatingActionButtonDefaults.containerColor,
  contentColor = FloatingActionButtonDefaults.contentColor,
  shape,
  elevation = FloatingActionButtonDefaults.elevation(),
  className = "",
  style,
  children,
  ...buttonProps
}: InternalFabProps) {
  const resolvedShape =
    shape ??
    (variant === "small"
      ? FloatingActionButtonDefaults.smallShape
      : variant === "large"
        ? FloatingActionButtonDefaults.largeShape
        : FloatingActionButtonDefaults.shape);

  const buttonStyle = {
    backgroundColor: containerColor,
    color: contentColor,
    borderRadius: resolvedShape,
    boxShadow: elevationShadow(elevation.defaultElevation),
    "--fab-shadow-hover": elevationShadow(elevation.hoveredElevation),
    "--fab-shadow-focus": elevationShadow(elevation.focusedElevation),
    "--fab-shadow-pressed": elevationShadow(elevation.pressedElevation),
    ...style,
  } as CSSProperties;

  return (
    <button
      {...buttonProps}
      type={type}
      onClick={onClick}
      className={[styles.fab, styles[variant], className].filter(Boolean).join(" ")}
      style={buttonStyle}
      data-variant={variant}
    >
      {children}
    </button>
  );
}

/** React/Web adaptation of AndroidX Material 3 1.4.0 FloatingActionButton. */
export function FloatingActionButton(props: StandardFabProps) {
  return <FabButton {...props} variant="default" />;
}

/** React/Web adaptation of AndroidX Material 3 1.4.0 SmallFloatingActionButton. */
export function SmallFloatingActionButton(props: StandardFabProps) {
  return <FabButton {...props} variant="small" />;
}

/** React/Web adaptation of AndroidX Material 3 1.4.0 LargeFloatingActionButton. */
export function LargeFloatingActionButton(props: StandardFabProps) {
  return <FabButton {...props} variant="large" />;
}

/**
 * React/Web adaptation of the two stable AndroidX ExtendedFloatingActionButton overloads.
 * The icon/text overload preserves the expanded/collapsed state; the content overload leaves
 * row composition to the caller.
 */
export function ExtendedFloatingActionButton(props: ExtendedFabWithIconProps | ExtendedFabContentProps) {
  if ("text" in props && props.text !== undefined) {
    const {
      text,
      icon,
      expanded = true,
      "aria-label": ariaLabel,
      ...common
    } = props;

    return (
      <FabButton
        {...common}
        variant="extended"
        shape={common.shape ?? FloatingActionButtonDefaults.extendedFabShape}
        aria-label={ariaLabel ?? (typeof text === "string" ? text : undefined)}
        data-expanded={String(expanded)}
      >
        <span className={styles.extendedIcon}>{icon}</span>
        <span className={styles.extendedText} aria-hidden={!expanded}>
          <span className={styles.extendedTextInner}>{text}</span>
        </span>
      </FabButton>
    );
  }

  const { children, ...common } = props as ExtendedFabContentProps;
  return (
    <FabButton
      {...common}
      variant="extendedContent"
      shape={common.shape ?? FloatingActionButtonDefaults.extendedFabShape}
    >
      {children}
    </FabButton>
  );
}
