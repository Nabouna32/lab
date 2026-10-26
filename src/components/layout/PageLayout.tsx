import type { ReactNode } from "react";

type ContentWidth = "form" | "form-wide" | "account" | "narrow" | "medium" | "default" | "wide";
type PageSpacing = "none" | "compact" | "default" | "comfortable";

type PageContainerProps = {
  children: ReactNode;
  width?: ContentWidth;
  spacing?: PageSpacing;
  className?: string;
};

/**
 * Loculary-specific page composition, not an AndroidX API.
 * Keep only product-level concerns here (content width, page gutters and outer spacing).
 * Internal layout and child spacing should use the shared Compose layout ports.
 */
export function PageContainer({
  children,
  width = "wide",
  spacing = "default",
  className = "",
}: PageContainerProps) {
  const widthClass = {
    form: "max-w-[var(--layout-content-form)]",
    "form-wide": "max-w-[var(--layout-content-form-wide)]",
    account: "max-w-[var(--layout-content-account)]",
    narrow: "max-w-[var(--layout-content-narrow)]",
    medium: "max-w-[var(--layout-content-medium)]",
    default: "max-w-[var(--layout-content-default)]",
    wide: "max-w-[var(--layout-content-wide)]",
  }[width];

  const spacingClass = {
    none: "",
    compact: "py-[var(--space-6)] sm:py-[var(--space-8)] lg:py-[var(--space-10)]",
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
