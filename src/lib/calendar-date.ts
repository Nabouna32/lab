export function createCalendarDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month, day);
  return date;
}

export function parseCalendarDate(value: string | undefined): Date | null {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1) return null;

  const date = createCalendarDate(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function daysInCalendarMonth(year: number, month: number): number {
  return createCalendarDate(year, month + 1, 0).getDate();
}

export function addCalendarMonthsClamped(date: Date, months: number): Date {
  const firstOfTargetMonth = createCalendarDate(date.getFullYear(), date.getMonth() + months, 1);
  if (Number.isNaN(firstOfTargetMonth.getTime())) return firstOfTargetMonth;

  return createCalendarDate(
    firstOfTargetMonth.getFullYear(),
    firstOfTargetMonth.getMonth(),
    Math.min(
      date.getDate(),
      daysInCalendarMonth(firstOfTargetMonth.getFullYear(), firstOfTargetMonth.getMonth()),
    ),
  );
}
