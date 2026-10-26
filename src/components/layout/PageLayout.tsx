import type { ReactNode } from "react";

type ContentWidth = "narrow" | "default" | "wide";
type PageSpacing = "compact" | "default" | "comfortable";

type PageContainerProps = {
  children: ReactNode;
  width?: ContentWidth;
  spacing?: PageSpacing;
  className?: string;
};

/**
 * Shared page frame. Keep page gutters and vertical rhythm in the design tokens;
 * individual pages should only opt into a width/spacing variant when the content needs it.
 */
export function PageContainer({
  children,
  width = "wide",
  spacing = "default",
  className = "",
}: PageContainerProps) {
  const widthClass = {
    narrow: "max-w-[var(--layout-content-narrow)]",
    default: "max-w-[var(--layout-content-default)]",
    wide: "max-w-[var(--layout-content-wide)]",
  }[width];

  const spacingClass = {
    compact: "py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-8)]",
    default: "py-[var(--space-8)] sm:py-[var(--space-10)] lg:py-[var(--space-10)]",
    comfortable: "py-[var(--space-10)] sm:py-[var(--space-12)] lg:py-[var(--space-12)]",
  }[spacing];

  return (
    <div
      className={`mx-auto w-full ${widthClass} px-[var(--layout-page-gutter)] ${spacingClass} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

type PageStackProps = {
  children: ReactNode;
  gap?: "tight" | "default" | "relaxed";
  className?: string;
};

/** Shared vertical rhythm for page sections and grouped content. */
export function PageStack({ children, gap = "default", className = "" }: PageStackProps) {
  const gapClass = {
    tight: "space-y-[var(--layout-inline-gap)]",
    default: "space-y-[var(--layout-item-gap)]",
    relaxed: "space-y-[var(--layout-content-gap)]",
  }[gap];

  return <div className={`${gapClass} ${className}`.trim()}>{children}</div>;
}
