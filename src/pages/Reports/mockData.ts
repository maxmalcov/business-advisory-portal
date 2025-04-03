
import { ReportData, ChartData } from './types';

export const reportsList: ReportData[] = [
  {
    id: '1',
    name: 'Q1 Financial Summary',
    period: 'Q1 2025',
    date: '2025-03-31',
    status: 'completed',
    type: 'financial'
  },
  {
    id: '2',
    name: 'Q2 Financial Summary',
    period: 'Q2 2025',
    date: '2025-06-30',
    status: 'pending',
    type: 'financial'
  },
  {
    id: '3',
    name: 'Annual Tax Report',
    period: 'FY 2024',
    date: '2024-12-31',
    status: 'completed',
    type: 'tax'
  },
  {
    id: '4',
    name: 'March Payroll Summary',
    period: 'March 2025',
    date: '2025-03-31',
    status: 'completed',
    type: 'payroll'
  },
  {
    id: '5',
    name: 'April Payroll Summary',
    period: 'April 2025',
    date: '2025-04-30',
    status: 'processing',
    type: 'payroll'
  },
  {
    id: '6',
    name: 'Employee Benefits Analysis',
    period: 'Q1 2025',
    date: '2025-03-31',
    status: 'completed',
    type: 'custom'
  },
];

export const reportsTypesData: ChartData[] = [
  { name: 'Financial', value: 12 },
  { name: 'Tax', value: 8 },
  { name: 'Payroll', value: 24 },
  { name: 'Custom', value: 4 }
];

export const monthlyReportsData: ChartData[] = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 6 },
  { name: 'Mar', value: 8 },
  { name: 'Apr', value: 7 },
  { name: 'May', value: 5 },
  { name: 'Jun', value: 0 },
  { name: 'Jul', value: 0 },
  { name: 'Aug', value: 0 },
  { name: 'Sep', value: 0 },
  { name: 'Oct', value: 0 },
  { name: 'Nov', value: 0 },
  { name: 'Dec', value: 0 },
];

export const reportStatusData: ChartData[] = [
  { name: 'Completed', value: 28 },
  { name: 'Processing', value: 12 },
  { name: 'Pending', value: 8 }
];
