import type { CSSProperties } from "react";
import AppLink, { type AppLinkProps, type AppLinkVariant } from "@/components/ui/AppLink";

type Variant = "primary" | "secondary" | "danger";

type AccountActionLinkProps = Omit<AppLinkProps, "variant"> & {
  variant?: Variant;
};

const linkVariants: Record<Variant, AppLinkVariant> = {
  primary: "action-filled",
  secondary: "action-outlined",
  danger: "action-text",
};

export function AccountActionLink({
  children,
  variant = "secondary",
  style,
  ...props
}: AccountActionLinkProps) {
  const linkStyle = variant === "danger"
    ? { ...style, "--button-content-color": "var(--error)" } as CSSProperties
    : style;

  return (
    <AppLink
      {...props}
      variant={linkVariants[variant]}
      style={linkStyle}
    >
      {children}
    </AppLink>
  );
}
