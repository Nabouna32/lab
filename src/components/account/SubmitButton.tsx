"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export default function SubmitButton({
  children,
  pendingLabel,
  className = "",
  danger = false,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className?: string;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      data-pending={pending ? "true" : "false"}
      data-danger={danger ? "true" : "false"}
      className={[
        danger
          ? "border-[var(--error)] bg-[var(--error)] text-[var(--on-error)] hover:brightness-[.94]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}
