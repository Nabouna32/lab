"use client";

import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";
import type { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      storage="local"
      storageKey="theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      noScript
    >
      {children}
    </NextThemesProvider>
  );
}
