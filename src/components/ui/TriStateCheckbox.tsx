import { Checkbox } from "@/components/ui/Checkbox";
import type { ReactNode } from "react";

export type TriState = "off" | "on" | "indeterminate";

export type TriStateCheckboxProps = {
  inputId: string;
  label: ReactNode;
  state: TriState;
  onStateChange: (state: TriState) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Web adaptation of AndroidX Material 3 TriStateCheckbox.
 * Indeterminate normally reflects a parent with a partially selected child set.
 */
export function TriStateCheckbox({
  inputId,
  label,
  state,
  onStateChange,
  disabled = false,
  className,
}: TriStateCheckboxProps) {
  return (
    <Checkbox
      inputId={inputId}
      label={label}
      checked={state === "on"}
      indeterminate={state === "indeterminate"}
      disabled={disabled}
      className={className}
      onCheckedChange={(checked) => onStateChange(checked ? "on" : "off")}
    />
  );
}
