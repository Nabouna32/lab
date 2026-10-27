"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Slider } from "@/components/ui/Slider";
import { CopyButton } from "@/components/ui/CopyButton";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { estimatePasswordEntropy, generatePassword, getPasswordStrength, PASSWORD_LIMITS, type PasswordOptions } from "@/lib/password-generator";

const defaultOptions: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
};

const strengthLabels = {
  fr: { weak: "Faible", fair: "Moyen", strong: "Fort", "very-strong": "Très fort", estimate: "Estimation indicative", bits: "bits d’entropie théoriques" },
  en: { weak: "Weak", fair: "Fair", strong: "Strong", "very-strong": "Very strong", estimate: "Rough estimate", bits: "theoretical entropy bits" },
} as const;

const strengthPercent = { weak: 25, fair: 50, strong: 75, "very-strong": 100 } as const;

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

  const strength = password ? getPasswordStrength(estimatePasswordEntropy(options)) : null;
  const labels = strengthLabels[locale];

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:p-8">
        <div>
          <Slider
            inputId="password-length"
            label={t.length}
            value={options.length}
            valueLabel={String(options.length)}
            min={PASSWORD_LIMITS.minLength}
            max={PASSWORD_LIMITS.maxLength}
            onValueChange={(length) => update("length", length)}
            className="mt-4"
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
          <output aria-live="polite" className="mt-4 block min-h-28 break-all rounded-[var(--shape-corner-medium)] border border-[var(--border)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">
            {password || t.emptyResult}
          </output>
          {strength && (
            <div className="mt-4" aria-label={labels.estimate}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--foreground)]">{locale === "fr" ? "Robustesse estimée" : "Estimated strength"}</span>
                <span className="font-semibold text-[var(--foreground)]">{labels[strength]}</span>
              </div>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-variant)]"
                role="meter"
                aria-label={labels.estimate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={strengthPercent[strength]}
                aria-valuetext={labels[strength]}
              >
                <div className="h-full rounded-full bg-[var(--primary)] transition-[width] motion-reduce:transition-none" style={{ width: strengthPercent[strength] + "%" }} />
              </div>
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                {Math.round(estimatePasswordEntropy(options))} {labels.bits}. {locale === "fr" ? "Estimation basée sur la longueur et les caractères possibles, pas une garantie de sécurité." : "Estimated from length and possible characters, not a security guarantee."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
