"use client";

import { ViewTransition } from "react";

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default={{ "home-explorer": "loculary-page", default: "none" }}>
      <div data-page-transition-surface>{children}</div>
    </ViewTransition>
  );
}
