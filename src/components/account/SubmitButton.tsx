"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonVariant } from "@/components/ui/Button";

export default function SubmitButton({
  children,
  pendingLabel,
  className = "",
  danger = false,
  variant,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  danger?: boolean;
  variant?: ButtonVariant;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant ?? (danger ? "danger" : "primary")}
      disabled={pending}
      aria-disabled={pending}
      data-pending={pending ? "true" : "false"}
      data-danger={danger ? "true" : "false"}
      className={className}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
