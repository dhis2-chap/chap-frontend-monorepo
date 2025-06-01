import { format, parse, startOfMonth } from 'date-fns';

export const dateToMonthFormat = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM');
};

export const monthToDateFormat = (monthString: string): string => {
    const date = parse(monthString, 'yyyy-MM', new Date());
    const monthStart = startOfMonth(date);
    return format(monthStart, 'yyyy-MM-dd');
}; 