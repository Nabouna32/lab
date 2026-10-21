"use client";

import { useFormStatus } from "react-dom";
import {
  Button,
  DestructiveButton,
  ElevatedButton,
  FilledTonalButton,
  OutlinedButton,
  TextButton,
  type ButtonProps,
} from "@/components/ui/Button";

type SubmitButtonVariant = "filled" | "elevated" | "filled-tonal" | "outlined" | "text";

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
  const Component = danger ? DestructiveButton : variants[variant];

  return (
    <Component
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      data-pending={pending ? "true" : "false"}
      data-danger={danger ? "true" : "false"}
      className={className}
    >
      {pending ? pendingLabel : children}
    </Component>
  );
}
