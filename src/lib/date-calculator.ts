export type DateAdjustmentUnit = "days" | "weeks" | "months" | "years";
export type DateAdjustmentDirection = "add" | "subtract";

export type DateAdjustment = {
  date: Date;
  amount: number;
  unit: DateAdjustmentUnit;
  direction: DateAdjustmentDirection;
};

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(`${value}T12:00:00`);

  if (
    !isValidDate(date) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function addMonthsClamped(date: Date, months: number): Date {
  const day = date.getDate();
  const result = new Date(date.getTime());

  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  result.setDate(Math.min(day, daysInMonth(result.getFullYear(), result.getMonth())));

  return result;
}

function addYearsClamped(date: Date, years: number): Date {
  return addMonthsClamped(date, years * 12);
}

export function calculateDateAdjustment(
  startDate: Date,
  amount: number,
  unit: DateAdjustmentUnit,
  direction: DateAdjustmentDirection,
): Date | null {
  if (!isValidDate(startDate) || !Number.isInteger(amount) || amount < 0) {
    return null;
  }

  const signedAmount = direction === "subtract" ? -amount : amount;
  const result = new Date(startDate.getTime());

  switch (unit) {
    case "days":
      result.setDate(result.getDate() + signedAmount);
      break;
    case "weeks":
      result.setDate(result.getDate() + signedAmount * 7);
      break;
    case "months": {
      const adjusted = addMonthsClamped(result, signedAmount);
      return isValidDate(adjusted) ? adjusted : null;
    }
    case "years": {
      const adjusted = addYearsClamped(result, signedAmount);
      return isValidDate(adjusted) ? adjusted : null;
    }
  }

  return isValidDate(result) ? result : null;
}
