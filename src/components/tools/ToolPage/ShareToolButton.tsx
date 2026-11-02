"use client";

import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { Tooltip } from "@/components/ui/Tooltip";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createToolShareUrl } from "@/lib/tools/share-url";
import { copyTextToClipboard } from "@/lib/copy";

type ShareToolButtonProps = {
  title: string;
  description: string;
  locale: Locale;
};

export default function ShareToolButton({ title, description, locale }: ShareToolButtonProps) {
  const messages = getMessages(locale).actions;
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 2400);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleShare() {
    setStatus("idle");
    const url = createToolShareUrl(window.location.origin, window.location.pathname);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: description, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        // A failed or unavailable native share sheet falls back to copying the link.
      }
    }

    try {
      const copied = await copyTextToClipboard(url);
      setStatus(copied ? "copied" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <Tooltip content={messages.shareTool}>
          <IconButton label={messages.shareTool} title={messages.shareTool} onClick={handleShare}>
            <MaterialIcon name="share" size={24} />
          </IconButton>
        </Tooltip>
        <span className="m3-type-label-medium text-[var(--on-surface-variant)]">{messages.shareTool}</span>
      </div>
      {status !== "idle" && (
        <span role="status" aria-live="polite" className="max-w-48 text-right text-xs text-[var(--muted)]">
          {status === "copied" ? messages.shareLinkCopied : messages.shareLinkError}
        </span>
      )}
    </div>
  );
}
