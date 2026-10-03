"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { getMessages } from "@/lib/i18n/messages";
import { useToolRuntime } from "@/components/tools/ToolPage/ToolRuntimeProvider";
import { Button } from "@/components/ui/Button";

type CopyButtonProps = {
  value: string;
  label?: string;
  copiedLabel?: string;
};

export function CopyButton({ value, label, copiedLabel }: CopyButtonProps) {
  const locale = useLocale();
  const t = getMessages(locale).actions;
  const [copied, setCopied] = useState(false);
  const { clipboard } = useToolRuntime();

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    const success = await clipboard.writeText(value);
    if (success) setCopied(true);
  }

  const buttonLabel = copied ? copiedLabel ?? t.copied : label ?? t.copy;

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={handleCopy}
      disabled={!value}
      aria-label={buttonLabel}
    >
      <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
      <span aria-live="polite">{buttonLabel}</span>
    </Button>
  );
}
