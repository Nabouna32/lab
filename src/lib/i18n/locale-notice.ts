import type { Locale } from "./config";

export const localeNoticeMessages: Record<Locale, { message: string; action: string; dismiss: string }> = {
  fr: {
    message: "Cette page est disponible en anglais.",
    action: "Passer en anglais",
    dismiss: "Fermer",
  },
  en: {
    message: "This page is available in French.",
    action: "Switch to French",
    dismiss: "Dismiss",
  },
};
