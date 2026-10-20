"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import { createToolShareUrl } from "@/lib/tools/share-url";

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
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="secondary"
        leadingIcon
        type="button"
        onClick={handleShare}
        aria-label={messages.shareTool}
      >
        <MaterialIcon name="arrow_outward" size={18} />
        <span>{messages.shareTool}</span>
      </Button>
      {status !== "idle" && (
        <span role="status" aria-live="polite" className="max-w-48 text-right text-xs text-[var(--muted)]">
          {status === "copied" ? messages.shareLinkCopied : messages.shareLinkError}
        </span>
      )}
    </div>
  );
}
