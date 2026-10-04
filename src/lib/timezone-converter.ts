export type TimeZoneConversionStatus = "exact" | "ambiguous" | "nonexistent";

export type ZonedDateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type TimeZoneConversionResult = {
  instant: Date;
  source: ZonedDateTimeParts;
  destination: ZonedDateTimeParts;
  sourceOffsetMinutes: number;
  destinationOffsetMinutes: number;
  status: TimeZoneConversionStatus;
};

const FALLBACK_TIME_ZONES = [
  "UTC",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Sao_Paulo",
  "America/Mexico_City",
  "America/Argentina/Buenos_Aires",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

const PART_FORMAT_OPTIONS = {
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
} as const;

function getDateTimeParts(date: Date, timeZone: string): ZonedDateTimeParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    ...PART_FORMAT_OPTIONS,
    timeZone,
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)]),
  ) as Record<string, number>;

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function utcMilliseconds(parts: ZonedDateTimeParts): number {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second, 0);
  return date.getTime();
}

function sameParts(a: ZonedDateTimeParts, b: ZonedDateTimeParts): boolean {
  return a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.hour === b.hour &&
    a.minute === b.minute &&
    a.second === b.second;
}

function offsetAt(date: Date, timeZone: string): number {
  const parts = getDateTimeParts(date, timeZone);
  return Math.round((utcMilliseconds(parts) - date.getTime()) / 60_000);
}

function parseLocalDateTime(value: string): ZonedDateTimeParts | null {
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})$/.exec(value);
  if (!match) return null;

  const parts: ZonedDateTimeParts = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: 0,
  };

  if (
    parts.year < 1 ||
    parts.month < 1 || parts.month > 12 ||
    parts.day < 1 || parts.day > 31 ||
    parts.hour > 23 ||
    parts.minute > 59
  ) {
    return null;
  }

  const normalized = getDateTimeParts(new Date(utcMilliseconds(parts)), "UTC");
  return sameParts(normalized, parts) ? parts : null;
}

function findMatchingInstants(parts: ZonedDateTimeParts, timeZone: string): Date[] {
  const wallMilliseconds = utcMilliseconds(parts);
  const offsets = new Set<number>();

  for (let deltaHours = -36; deltaHours <= 36; deltaHours += 1) {
    offsets.add(offsetAt(new Date(wallMilliseconds + deltaHours * 3_600_000), timeZone));
  }

  const matches = new Set<number>();
  for (const offsetMinutes of offsets) {
    const candidate = wallMilliseconds - offsetMinutes * 60_000;
    if (sameParts(getDateTimeParts(new Date(candidate), timeZone), parts)) {
      matches.add(candidate);
    }
  }

  return [...matches]
    .sort((a, b) => a - b)
    .map((value) => new Date(value));
}

export function getTimeZoneOptions(): string[] {
  const zones = typeof Intl.supportedValuesOf === "function"
    ? Intl.supportedValuesOf("timeZone")
    : [...FALLBACK_TIME_ZONES];

  return [...new Set(["UTC", ...zones])].sort((a, b) => a.localeCompare(b));
}

export function isSupportedTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function convertTimeZone(
  value: string,
  sourceTimeZone: string,
  destinationTimeZone: string,
): TimeZoneConversionResult | null {
  if (!isSupportedTimeZone(sourceTimeZone) || !isSupportedTimeZone(destinationTimeZone)) {
    return null;
  }

  const sourceParts = parseLocalDateTime(value);
  if (!sourceParts) return null;

  const matches = findMatchingInstants(sourceParts, sourceTimeZone);
  if (matches.length === 0) return null;

  const instant = matches[0];
  const destination = getDateTimeParts(instant, destinationTimeZone);

  return {
    instant,
    source: sourceParts,
    destination,
    sourceOffsetMinutes: offsetAt(instant, sourceTimeZone),
    destinationOffsetMinutes: offsetAt(instant, destinationTimeZone),
    status: matches.length > 1 ? "ambiguous" : "exact",
  };
}

export function formatOffset(minutes: number): string {
  if (minutes === 0) return "UTC";
  const sign = minutes > 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60);
  const remainder = absolute % 60;
  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}
