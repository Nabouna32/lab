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
      variant={danger ? "danger" : "primary"}
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
