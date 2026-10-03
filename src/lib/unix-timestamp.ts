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
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const milliseconds = date.getTime();
  return { date, iso: date.toISOString(), timestampSeconds: milliseconds / 1000, timestampMilliseconds: milliseconds };
}

export function formatTimestamp(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
