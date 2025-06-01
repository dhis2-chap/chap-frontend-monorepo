import { getISOWeek, startOfISOWeek, format, parse, getISOWeekYear } from 'date-fns';

export const dateToWeekFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const isoYear = getISOWeekYear(date);
  const weekNumber = getISOWeek(date);
  return `${isoYear}-W${String(weekNumber).padStart(2, '0')}`;
};

export const weekToDateFormat = (weekString: string): string => {
  const startDate = parse(weekString, 'RRRR-\'W\'II', new Date());
  const weekStart = startOfISOWeek(startDate);
  return format(weekStart, 'yyyy-MM-dd');
};
