"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { getMessages } from "@/lib/i18n/messages";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type ClearButtonProps = {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
};

export function ClearButton({ onClear, disabled = false, label }: ClearButtonProps) {
  const locale = useLocale();
  const t = getMessages(locale).actions;
  const buttonLabel = label ?? t.clear;

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={onClear}
      disabled={disabled}
      aria-label={buttonLabel}
    >
      <MaterialIcon name="restart_alt" size={18} />
      <span>{buttonLabel}</span>
    </Button>
  );
}
