"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
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
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
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
            className="mt-4 w-full cursor-pointer rounded-full accent-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          />

          <fieldset className="mt-7">
            <legend className="text-sm font-medium text-[var(--foreground)]">{t.characters}</legend>
            <div className="mt-3 grid gap-x-4 border-y border-[var(--border)] sm:grid-cols-2">
              {([
                ["lowercase", t.lowercase],
                ["uppercase", t.uppercase],
                ["numbers", t.numbers],
                ["symbols", t.symbols],
              ] as const).map(([key, label]) => (
                <Checkbox
                  key={key}
                  inputId={`password-option-${key}`}
                  name={key}
                  label={label}
                  checked={options[key]}
                  onCheckedChange={(checked) => update(key, checked)}
                  className="border-b border-[var(--border)] py-3 transition-colors last:border-b-0 hover:text-[var(--accent)] focus-within:text-[var(--accent)] sm:[&:nth-child(3)]:border-b-0 sm:[&:nth-child(4)]:border-b-0"
                />
              ))}
            </div>
          </fieldset>

          <Checkbox
            inputId="password-exclude-ambiguous"
            name="excludeAmbiguous"
            label={t.excludeAmbiguous}
            checked={options.excludeAmbiguous}
            onCheckedChange={(checked) => update("excludeAmbiguous", checked)}
            className="mt-4 py-2"
          />

          {error && <p role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">{error}</p>}

          <div className="mt-7">
            <Button type="button" onClick={generate}>{t.generate}</Button>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">{t.result}</p>
            {password && <CopyButton value={password} label={t.copy} />}
          </div>
          <output aria-live="polite" className="mt-4 block min-h-28 break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">
            {password || t.emptyResult}
          </output>
        </div>
      </div>
    </section>
  );
}
