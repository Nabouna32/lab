"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { OutlinedTextField, type OutlinedTextFieldProps } from "@/components/ui/OutlinedTextField";

export type OutlinedSecureTextFieldProps = Omit<
  OutlinedTextFieldProps,
  "type" | "trailingContent" | "spellCheck" | "autoCapitalize"
> & {
  showPasswordLabel: string;
  hidePasswordLabel: string;
  trailingContent?: ReactNode;
};

/** Web adaptation of AndroidX OutlinedSecureTextField using a native password input and a localized visibility action. */
export function OutlinedSecureTextField({
  showPasswordLabel,
  hidePasswordLabel,
  trailingContent,
  disabled = false,
  autoComplete,
  ...fieldProps
}: OutlinedSecureTextFieldProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <OutlinedTextField
      {...fieldProps}
      type={revealed ? "text" : "password"}
      autoComplete={autoComplete ?? "current-password"}
      spellCheck={false}
      autoCapitalize="off"
      disabled={disabled}
      trailingContent={
        <>
          {trailingContent}
          <IconButton
            label={revealed ? hidePasswordLabel : showPasswordLabel}
            onClick={() => setRevealed((visible) => !visible)}
            disabled={disabled}
          >
            <MaterialIcon name={revealed ? "visibility_off" : "visibility"} size={24} />
          </IconButton>
        </>
      }
    />
  );
}
