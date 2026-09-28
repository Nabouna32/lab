import type { Locale } from "../i18n/config.ts";
import { getMessages } from "../i18n/messages.ts";
import type { ToolProcessingMetadata } from "./types";

export type ToolProcessingPresentation = { icon: string; label: string; summary: string };

export function getToolProcessingPresentation(processing: ToolProcessingMetadata, locale: Locale = "fr"): ToolProcessingPresentation {
  const t = getMessages(locale).processing;
  switch (processing.mode) {
    case "local": return { icon: "🔒", label: t.localLabel, summary: t.localSummary };
    case "external": return { icon: "🌐", label: t.externalLabel, summary: t.externalSummary };
    case "server": return { icon: "☁️", label: t.serverLabel, summary: t.serverSummary };
    case "hybrid": return { icon: "🔒 + 🌐", label: t.hybridLabel, summary: t.hybridSummary };
  }
}
