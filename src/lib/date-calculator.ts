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
    case "months":
      return addMonthsClamped(result, signedAmount);
    case "years":
      return addYearsClamped(result, signedAmount);
  }

  return isValidDate(result) ? result : null;
}
