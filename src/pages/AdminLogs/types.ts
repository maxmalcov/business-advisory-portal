
export interface LogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  level: string;
  category: string;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface WeeklyDataItem {
  name: string;
  users: number;
  files: number;
  emails: number;
  security: number;
}
