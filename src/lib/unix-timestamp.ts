export type TimestampUnit = "seconds" | "milliseconds";

export type TimestampResult = {
  date: Date;
  iso: string;
  timestampSeconds: number;
  timestampMilliseconds: number;
};

export function timestampToDate(value: number, unit: TimestampUnit): TimestampResult | null {
  if (!Number.isFinite(value)) return null;
  const milliseconds = unit === "seconds" ? value * 1000 : value;
  if (!Number.isFinite(milliseconds)) return null;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) return null;
  return { date, iso: date.toISOString(), timestampSeconds: milliseconds / 1000, timestampMilliseconds: milliseconds };
}

export function dateTimeLocalToTimestamp(value: string): TimestampResult | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value);
  if (!match) return null;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText = "0", fractionText = ""] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const millisecond = Number(fractionText.padEnd(3, "0"));

  if (
    month < 1 || month > 12 ||
    day < 1 || day > 31 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return null;
  }

  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(hour, minute, second, millisecond);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second ||
    date.getMilliseconds() !== millisecond
  ) {
    return null;
  }

  const milliseconds = date.getTime();
  return { date, iso: date.toISOString(), timestampSeconds: milliseconds / 1000, timestampMilliseconds: milliseconds };
}

export function formatTimestamp(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
