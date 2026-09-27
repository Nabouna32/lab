import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

export function BackToTools({ locale }: { locale: Locale }) {
  return (
    <div className="mt-8 flex justify-start">
      <Link
        href={`/${locale}/outils`}
        className="text-sm font-medium text-[var(--accent)] hover:underline"
      >
        {getMessages(locale).tools.back}
      </Link>
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="mt-4 rounded-2xl bg-[var(--accent-soft)] p-5">{children}</div>;
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl bg-[var(--surface-soft)] p-5">
      {children}
    </div>
  );
}
