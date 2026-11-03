import type { Locale } from "./config";

export const localeNoticeMessages: Record<Locale, { message: string; action: string; dismiss: string }> = {
  fr: {
    message: "La langue de votre compte est l’anglais.",
    action: "Passer en anglais",
    dismiss: "Fermer",
  },
  en: {
    message: "Your account language is French.",
    action: "Switch to French",
    dismiss: "Dismiss",
  },
};
