"use client";

import { useFormStatus } from "react-dom";
import {
  Button,
  ElevatedButton,
  FilledTonalButton,
  OutlinedButton,
  TextButton,
  type ButtonColors,
  type ButtonProps,
} from "@/components/ui/Button";

type SubmitButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

const destructiveColors = {
  containerColor: "var(--error)",
  contentColor: "var(--on-error)",
  disabledContainerColor: "color-mix(in srgb, var(--on-surface) 10%, transparent)",
  disabledContentColor: "color-mix(in srgb, var(--on-surface) 38%, transparent)",
} satisfies ButtonColors;

const variants = {
  filled: Button,
  elevated: ElevatedButton,
  "filled-tonal": FilledTonalButton,
  outlined: OutlinedButton,
  text: TextButton,
} satisfies Record<SubmitButtonVariant, (props: ButtonProps) => React.ReactNode>;

export default function SubmitButton({
  children,
  pendingLabel,
  className = "",
  danger = false,
  variant = "filled",
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  danger?: boolean;
  variant?: SubmitButtonVariant;
}) {
  const { pending } = useFormStatus();
  const Component = danger ? Button : variants[variant];

  return (
    <Component
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      data-pending={pending ? "true" : "false"}
      data-danger={danger ? "true" : "false"}
      colors={danger ? destructiveColors : undefined}
      className={className}
    >
      {pending ? pendingLabel : children}
    </Component>
  );
}
