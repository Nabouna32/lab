import { addCalendarMonthsClamped, daysInCalendarMonth, parseCalendarDate } from "./calendar-date.ts";

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
  return parseCalendarDate(value);
}

function addMonthsClamped(date: Date, months: number): Date {
  return addCalendarMonthsClamped(date, months);
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
