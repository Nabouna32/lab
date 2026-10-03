"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorActions } from "@/components/tools/calculator/CalculatorActions";
import { CalculatorField } from "@/components/tools/calculator/CalculatorField";
import { CalculatorResult } from "@/components/tools/calculator/CalculatorResult";
import { CalculatorShell } from "@/components/tools/calculator/CalculatorShell";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { formatToolNumber, parseLocalizedNumber } from "@/lib/numbers";
import {
  convertUnit,
  UNIT_CONVERTER_CATEGORIES,
  UNIT_CONVERTER_UNITS,
  type UnitConverterCategory,
} from "@/lib/unit-converter";

export default function UnitConverter() {
  const locale = useLocale();
  const t = getToolMessages(locale).unitConverter;
  const [value, setValue] = useState("");
  const [category, setCategory] = useState<UnitConverterCategory>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const units = UNIT_CONVERTER_UNITS[category];

  const result = useMemo(() => {
    if (value.trim() === "") return null;
    const numericValue = parseLocalizedNumber(value);
    if (numericValue === null) return null;
    return convertUnit(numericValue, category, from, to);
  }, [value, category, from, to]);

  const hasInvalidInput = value.trim() !== "" && result === null;

  function changeCategory(nextCategory: UnitConverterCategory) {
    setCategory(nextCategory);
    const nextUnits = UNIT_CONVERTER_UNITS[nextCategory];
    setFrom(nextUnits[0].id);
    setTo(nextUnits[1]?.id ?? nextUnits[0].id);
  }

  function swapUnits() {
    setFrom(to);
    setTo(from);
  }

  function clear() {
    setValue("");
  }

  const fromLabel = units.find((unit) => unit.id === from)?.symbol ?? from;
  const toLabel = units.find((unit) => unit.id === to)?.symbol ?? to;
  const formattedResult = result === null ? null : `${formatToolNumber(result, locale, 8)} ${toLabel}`;

  return (
    <CalculatorShell>
      <CalculatorActions showClear={value !== ""} onClear={clear} />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">
        <CalculatorField
          label={t.value}
          inputId="unit-converter-value"
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t.placeholder}
          aria-invalid={hasInvalidInput}
          aria-describedby={hasInvalidInput ? "unit-converter-error" : undefined}
        />

        <Select
          label={t.category}
          id="unit-converter-category"
          value={category}
          onChange={(event) => changeCategory(event.target.value as UnitConverterCategory)}
        >
          {UNIT_CONVERTER_CATEGORIES.map((item) => (
            <option key={item} value={item}>{t.categories[item]}</option>
          ))}
        </Select>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Select
            label={t.from}
            id="unit-converter-from"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.symbol}</option>
            ))}
          </Select>
          <div className="flex items-end">
            <Button type="button" variant="secondary" onClick={swapUnits} aria-label={t.swap} title={t.swap} className="h-11 w-11 px-0">
              ↕
            </Button>
          </div>
        </div>

        <Select
          label={t.to}
          id="unit-converter-to"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="lg:col-span-2"
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.symbol}</option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        <CalculatorResult
          label={t.result}
          value={formattedResult}
          emptyMessage={t.emptyResult}
        />
        {formattedResult && (
          <div className="mt-3 flex justify-end">
            <CopyButton value={formattedResult} label={t.copy} />
          </div>
        )}
      </div>

      {hasInvalidInput && (
        <ValidationMessage id="unit-converter-error">{t.invalid}</ValidationMessage>
      )}

      <p className="mt-4 text-sm text-[var(--muted)]">{t.hint}</p>
    </CalculatorShell>
  );
}
