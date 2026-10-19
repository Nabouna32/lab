export type Age = {
  years: number;
  months: number;
  days: number;
};

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

function compareCalendarDates(left: Date, right: Date): number {
  const leftValue = left.getFullYear() * 10_000 + (left.getMonth() + 1) * 100 + left.getDate();
  const rightValue = right.getFullYear() * 10_000 + (right.getMonth() + 1) * 100 + right.getDate();
  return Math.sign(leftValue - rightValue);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function addYearsClamped(date: Date, years: number): Date {
  const year = date.getFullYear() + years;
  const month = date.getMonth();
  return new Date(year, month, Math.min(date.getDate(), daysInMonth(year, month)));
}

function addMonthsClampedSequentially(date: Date, months: number): Date {
  let result = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  for (let index = 0; index < months; index += 1) {
    const nextMonth = new Date(result.getFullYear(), result.getMonth() + 1, 1);
    result = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      Math.min(result.getDate(), daysInMonth(nextMonth.getFullYear(), nextMonth.getMonth())),
    );
  }

  return result;
}

function calendarDayNumber(date: Date): number {
  const utcDate = new Date(0);
  utcDate.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate.getTime() / 86_400_000;
}

export function calculateAge(birthDate: Date, referenceDate: Date): Age | null {
  if (
    !isValidDate(birthDate) ||
    !isValidDate(referenceDate) ||
    compareCalendarDates(birthDate, referenceDate) > 0
  ) {
    return null;
  }

  let years = referenceDate.getFullYear() - birthDate.getFullYear();
  if (compareCalendarDates(addYearsClamped(birthDate, years), referenceDate) > 0) {
    years -= 1;
  }

  const afterYears = addYearsClamped(birthDate, years);
  let months =
    (referenceDate.getFullYear() - afterYears.getFullYear()) * 12 +
    referenceDate.getMonth() -
    afterYears.getMonth();

  if (compareCalendarDates(addMonthsClampedSequentially(afterYears, months), referenceDate) > 0) {
    months -= 1;
  }

  const afterMonths = addMonthsClampedSequentially(afterYears, months);
  const days = calendarDayNumber(referenceDate) - calendarDayNumber(afterMonths);

  return { years, months, days };
}
