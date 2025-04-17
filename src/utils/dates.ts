
import { format, isValid, parse, startOfMonth } from "date-fns";

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
};

export const formatMonthYear = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'MMMM yyyy') : '';
};

export const formatMonthYearCompact = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return isValid(parsedDate) ? format(parsedDate, 'MMM yyyy') : '';
};

export const parseMonthYear = (monthYearString: string): Date => {
  // Parse string like "January 2023" to a Date object
  const date = parse(monthYearString, 'MMMM yyyy', new Date());
  return startOfMonth(date);
};

export const getMonthYearForStorage = (date: Date): string => {
  // Format a date to yyyy-MM-01 format for storage
  return format(startOfMonth(date), 'yyyy-MM-dd');
};

export const getCurrentMonthYear = (): Date => {
  return startOfMonth(new Date());
};

export const getLastMonths = (count: number): Date[] => {
  const today = new Date();
  const months: Date[] = [];
  
  for (let i = 0; i < count; i++) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(month);
  }
  
  return months;
};
