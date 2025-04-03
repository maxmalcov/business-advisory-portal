
export interface ReportData {
  id: string;
  name: string;
  period: string;
  date: string;
  status: 'completed' | 'pending' | 'processing';
  type: 'financial' | 'tax' | 'payroll' | 'custom';
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ReportFilters {
  type: string | null;
  period: string | null;
  status: string | null;
}
