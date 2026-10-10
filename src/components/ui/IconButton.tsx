import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
  label: string;
  children: ReactNode;
  size?: "default" | "compact";
};

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  size = "default",
  ...props
}: IconButtonProps) {
  const dimensions = size === "compact" ? "h-10 w-10" : "h-10 w-10 sm:h-11 sm:w-11";

  return (
    <button
      type={type}
      aria-label={label}
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-full border border-transparent",
        "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[var(--shadow-sm)]",
        "transition-[background-color,box-shadow,transform] duration-[var(--motion-standard)]",
        "hover:bg-[var(--accent-strong)] active:scale-[.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        "disabled:pointer-events-none disabled:opacity-50",
        dimensions,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
