import { parseLocalizedNumber } from "./numbers.ts";
import type { Locale } from "./i18n/config.ts";

const BITS_PER_BYTE = 8;
const BITS_PER_MEGABIT = 1_000_000;

export function calculateVideoBitrateMbps(durationSeconds: number, sizeBytes: number): number | null {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;
  if (!Number.isFinite(sizeBytes) || sizeBytes < 0) return null;
  const result = (sizeBytes * BITS_PER_BYTE) / durationSeconds / BITS_PER_MEGABIT;
  return Number.isFinite(result) ? result : null;
}

export function calculateVideoSizeBytes(durationSeconds: number, bitrateMbps: number): number | null {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;
  if (!Number.isFinite(bitrateMbps) || bitrateMbps < 0) return null;
  const result = (bitrateMbps * BITS_PER_MEGABIT * durationSeconds) / BITS_PER_BYTE;
  return Number.isFinite(result) ? result : null;
}

export function formatDurationSeconds(hours: number, minutes: number, seconds: number): number | null {
  if (![hours, minutes, seconds].every(Number.isFinite)) return null;
  if (hours < 0 || minutes < 0 || minutes >= 60 || seconds < 0 || seconds >= 60) return null;
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : null;
}

export type ParsedVideoNumericInput = {
  hasInput: boolean;
  value: number | null;
  invalid: boolean;
};

export function parseVideoNumericInput(value: string, locale: Locale): ParsedVideoNumericInput {
  const hasInput = value.trim() !== "";
  const parsed = hasInput ? parseLocalizedNumber(value, locale) : null;
  return {
    hasInput,
    value: parsed,
    invalid: hasInput && parsed === null,
  };
}

export type ParsedVideoDuration = {
  hasInput: boolean;
  duration: number | null;
  invalid: boolean;
};

export function parseVideoDurationInputs(
  hours: string,
  minutes: string,
  seconds: string,
  locale: Locale,
): ParsedVideoDuration {
  const parts = [
    parseVideoNumericInput(hours, locale),
    parseVideoNumericInput(minutes, locale),
    parseVideoNumericInput(seconds, locale),
  ];
  const hasInput = parts.some((part) => part.hasInput);
  const invalid = parts.some((part) => part.invalid);
  const duration = invalid
    ? null
    : formatDurationSeconds(
        parts[0].value ?? 0,
        parts[1].value ?? 0,
        parts[2].value ?? 0,
      );

  return { hasInput, duration, invalid };
}
