"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { generatePassword, PASSWORD_LIMITS, type PasswordOptions } from "@/lib/password-generator";

const defaultOptions: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

export default function PasswordGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).passwordGenerator;
  const [options, setOptions] = useState(defaultOptions);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
    setPassword("");
    setError("");
  }

  function generate() {
    try {
      setPassword(generatePassword(options));
      setError("");
    } catch {
      setPassword("");
      setError(t.invalid);
    }
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:p-8">
        <div>
          <div className="flex items-end justify-between gap-4">
            <label htmlFor="password-length" className="text-sm font-medium text-[var(--foreground)]">{t.length}</label>
            <output htmlFor="password-length" className="font-mono text-sm font-semibold text-[var(--foreground)]">{options.length}</output>
          </div>
          <input
            id="password-length"
            type="range"
            min={PASSWORD_LIMITS.minLength}
            max={PASSWORD_LIMITS.maxLength}
            value={options.length}
            onChange={(event) => update("length", Number(event.target.value))}
            className="mt-4 w-full accent-[var(--accent)]"
          />

          <fieldset className="mt-7">
            <legend className="text-sm font-medium text-[var(--foreground)]">{t.characters}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {([
                ["lowercase", t.lowercase],
                ["uppercase", t.uppercase],
                ["numbers", t.numbers],
                ["symbols", t.symbols],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm text-[var(--foreground)] transition hover:bg-[var(--background)]">
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={(event) => update(key, event.target.checked)}
                    className="size-4 accent-[var(--accent)]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(event) => update("excludeAmbiguous", event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            {t.excludeAmbiguous}
          </label>

          {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{error}</p>}

          <div className="mt-7">
            <Button type="button" onClick={generate}>{t.generate}</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
            {password && <CopyButton value={password} label={t.copy} />}
          </div>
          <output aria-live="polite" className="mt-4 block min-h-28 break-all rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">
            {password || t.emptyResult}
          </output>
        </div>
      </div>
    </section>
  );
}
