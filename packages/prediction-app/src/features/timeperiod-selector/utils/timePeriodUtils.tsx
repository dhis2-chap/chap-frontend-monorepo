import { Period } from "../interfaces/Period";
import {
  parse,
  format,
  addMonths,
  addWeeks,
  startOfISOWeek,
  getISOWeek,
  isAfter,
  isSameMonth,
  isSameYear
} from 'date-fns';

export const toDHIS2PeriodeData = (start: string, end: string, periodType: "week" | "month" | ""): Period[] => {
  if (periodType === "week") return getWeeks(start, end);
  if (periodType === "month") return getMonths(start, end);
  return [];
}

const getWeeks = (start: string, end: string): Period[] => {
  try {
    // Parse ISO week format (e.g., "2024-W01")
    const startDate = parse(start, 'yyyy-\'W\'II', new Date());
    const endDate = parse(end, 'yyyy-\'W\'II', new Date());

    // Safety check for unreasonable date ranges
    const yearDifference = endDate.getFullYear() - startDate.getFullYear();
    if (yearDifference > 100) {
      return [];
    }

    const weeks: Period[] = [];
    let currentDate = startOfISOWeek(startDate);
    const endWeekStart = startOfISOWeek(endDate);

    while (!isAfter(currentDate, endWeekStart)) {
      const year = currentDate.getFullYear();
      const weekNumber = getISOWeek(currentDate);
      const weekString = `${year}W${String(weekNumber).padStart(2, '0')}`;

      weeks.push({
        endDate: undefined,
        startDate: undefined,
        id: weekString,
      });

      currentDate = addWeeks(currentDate, 1);
    }

    return weeks;
  } catch (error) {
    console.error('Error parsing week dates:', error);
    return [];
  }
}

const getMonths = (start: string, end: string): Period[] => {
  try {
    // Parse month format (e.g., "2024-01")
    const startDate = parse(start, 'yyyy-MM', new Date());
    const endDate = parse(end, 'yyyy-MM', new Date());

    // Safety check for unreasonable date ranges
    const yearDifference = endDate.getFullYear() - startDate.getFullYear();
    if (yearDifference > 100) {
      return [];
    }

    const months: Period[] = [];
    let currentDate = startDate;

    while (
      isAfter(endDate, currentDate) ||
      (isSameYear(currentDate, endDate) && isSameMonth(currentDate, endDate))
    ) {
      const monthId = format(currentDate, 'yyyyMM');

      months.push({
        id: monthId,
        endDate: undefined,
        startDate: undefined,
      });

      currentDate = addMonths(currentDate, 1);
    }

    return months;
  } catch (error) {
    console.error('Error parsing month dates:', error);
    return [];
  }
}