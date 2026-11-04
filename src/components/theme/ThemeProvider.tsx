"use client";

import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";
import type { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: string;
};

export default function ThemeProvider({
  children,
  initialTheme,
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      initialTheme={initialTheme}
    >
      {children}
    </NextThemesProvider>
  );
}