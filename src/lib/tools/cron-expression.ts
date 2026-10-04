export type CronFieldName = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

export type CronField = {
  name: CronFieldName;
  values: number[];
  expression: string;
};

export type CronSchedule = {
  expression: string;
  fields: Record<CronFieldName, CronField>;
  description: string;
};

const FIELD_DEFINITIONS: ReadonlyArray<{ name: CronFieldName; min: number; max: number }> = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "dayOfMonth", min: 1, max: 31 },
  { name: "month", min: 1, max: 12 },
  { name: "dayOfWeek", min: 0, max: 7 },
];

function parseField(expression: string, min: number, max: number, name: CronFieldName): CronField {
  if (!expression) throw new Error("Empty Cron field.");
  const values = new Set<number>();

  for (const rawPart of expression.split(",")) {
    const part = rawPart.trim();
    if (!part) throw new Error("Invalid Cron list.");

    const [rangeExpression, stepExpression] = part.split("/");
    if (part.split("/").length > 2) throw new Error("Invalid Cron step.");

    const step = stepExpression === undefined ? 1 : Number(stepExpression);
    if (!Number.isInteger(step) || step < 1) throw new Error("Cron step must be a positive integer.");

    let start: number;
    let end: number;
    if (rangeExpression === "*") {
      start = min;
      end = max;
    } else if (rangeExpression.includes("-")) {
      const bounds = rangeExpression.split("-");
      if (bounds.length !== 2) throw new Error("Invalid Cron range.");
      start = Number(bounds[0]);
      end = Number(bounds[1]);
    } else {
      start = Number(rangeExpression);
      end = start;
    }

    if (!Number.isInteger(start) || !Number.isInteger(end) || start < min || end > max || start > end) {
      throw new Error(`Cron ${name} value is outside its allowed range.`);
    }

    for (let value = start; value <= end; value += step) values.add(value);
  }

  if (name === "dayOfWeek" && values.has(7)) values.add(0);
  return { name, values: [...values].sort((a, b) => a - b), expression };
}

export function parseCronExpression(expression: string): CronSchedule {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\\s+/);
  if (parts.length !== 5) throw new Error("Classic Cron expressions require exactly 5 fields.");

  const fields = {} as Record<CronFieldName, CronField>;
  FIELD_DEFINITIONS.forEach((definition, index) => {
    fields[definition.name] = parseField(parts[index], definition.min, definition.max, definition.name);
  });

  return {
    expression: trimmed,
    fields,
    description: describeCron(fields),
  };
}

function isWildcard(expression: string): boolean {
  return expression === "*";
}

function describeList(values: number[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return String(values[0]);
  return values.join(", ");
}

function describeField(field: CronField): string {
  const { expression, values, name } = field;
  if (isWildcard(expression)) {
    if (name === "minute") return "every minute";
    if (name === "hour") return "every hour";
    if (name === "dayOfMonth") return "every day of the month";
    if (name === "month") return "every month";
    return "every day of the week";
  }
  if (expression.startsWith("*/")) {
    const step = expression.slice(2);
    if (name === "minute") return `every ${step} minutes`;
    if (name === "hour") return `every ${step} hours`;
    if (name === "month") return `every ${step} months`;
  }
  if (name === "dayOfWeek") {
    const labels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return values.map((value) => labels[value]).join(", ");
  }
  return describeList(values);
}

function describeCron(fields: Record<CronFieldName, CronField>): string {
  const minute = describeField(fields.minute);
  const hour = describeField(fields.hour);
  const day = describeField(fields.dayOfMonth);
  const month = describeField(fields.month);
  const weekday = describeField(fields.dayOfWeek);

  if (fields.minute.expression === "*" && fields.hour.expression === "*" && fields.dayOfMonth.expression === "*" && fields.month.expression === "*" && fields.dayOfWeek.expression === "*") {
    return "Every minute";
  }
  if (fields.minute.expression === "0" && fields.hour.expression === "*" && fields.dayOfMonth.expression === "*" && fields.month.expression === "*" && fields.dayOfWeek.expression === "*") {
    return "At the start of every hour";
  }
  if (fields.minute.expression === "0" && fields.hour.expression === "0" && fields.dayOfMonth.expression === "*" && fields.month.expression === "*" && fields.dayOfWeek.expression === "*") {
    return "At midnight every day";
  }
  if (fields.minute.expression === "0" && fields.hour.expression === "9" && fields.dayOfMonth.expression === "*" && fields.month.expression === "*" && fields.dayOfWeek.expression === "1-5") {
    return "At 9:00 AM, Monday through Friday";
  }

  return `At minute ${minute} of hour ${hour}, on ${day}, in ${month}, when the day of week is ${weekday}.`;
}

function matchesField(value: number, field: CronField): boolean {
  return field.values.includes(value);
}

function matchesDate(date: Date, schedule: CronSchedule): boolean {
  const minuteMatch = matchesField(date.getMinutes(), schedule.fields.minute);
  const hourMatch = matchesField(date.getHours(), schedule.fields.hour);
  const monthMatch = matchesField(date.getMonth() + 1, schedule.fields.month);
  if (!minuteMatch || !hourMatch || !monthMatch) return false;

  const dayOfMonthMatch = matchesField(date.getDate(), schedule.fields.dayOfMonth);
  const dayOfWeekMatch = matchesField(date.getDay(), schedule.fields.dayOfWeek);
  const domRestricted = !isWildcard(schedule.fields.dayOfMonth.expression);
  const dowRestricted = !isWildcard(schedule.fields.dayOfWeek.expression);

  if (domRestricted && dowRestricted) return dayOfMonthMatch || dayOfWeekMatch;
  return dayOfMonthMatch && dayOfWeekMatch;
}

export function getNextCronRuns(schedule: CronSchedule, from = new Date(), count = 5): Date[] {
  if (count <= 0) return [];
  const runs: Date[] = [];
  const cursor = new Date(from);
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const limit = cursor.getTime() + 366 * 24 * 60 * 60 * 1000;
  while (cursor.getTime() <= limit && runs.length < count) {
    if (matchesDate(cursor, schedule)) runs.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + 1);
  }
  return runs;
}
