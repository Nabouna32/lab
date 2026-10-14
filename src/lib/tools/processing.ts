import type { Locale } from "../i18n/config.ts";
import { getMessages } from "../i18n/messages.ts";
import type { ToolProcessingMetadata } from "./types";

export type ToolProcessingIcon = "lock" | "public" | "cloud" | "sync_alt";
export type ToolProcessingPresentation = { icon: ToolProcessingIcon; label: string; summary: string };

export function getToolProcessingPresentation(processing: ToolProcessingMetadata, locale: Locale = "fr"): ToolProcessingPresentation {
  const t = getMessages(locale).processing;
  switch (processing.mode) {
    case "local": return { icon: "lock", label: t.localLabel, summary: t.localSummary };
    case "external": return { icon: "public", label: t.externalLabel, summary: t.externalSummary };
    case "server": return { icon: "cloud", label: t.serverLabel, summary: t.serverSummary };
    case "hybrid": return { icon: "sync_alt", label: t.hybridLabel, summary: t.hybridSummary };
  }
}
