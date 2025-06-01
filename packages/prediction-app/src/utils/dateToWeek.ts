import { getISOWeek, startOfISOWeek, format, parse } from 'date-fns';

export const dateToWeekFormat = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const weekNumber = getISOWeek(date);
  return `${year}-W${String(weekNumber).padStart(2, '0')}`;
};

export const weekToDateFormat = (weekString: string): string => {
  const startDate = parse(weekString, 'RRRR-\'W\'II', new Date());
  const weekStart = startOfISOWeek(startDate);
  return format(weekStart, 'yyyy-MM-dd');
};
