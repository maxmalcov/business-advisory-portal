export enum LogCategory {
  USER = 'user',
  EMAIL = 'email',
  SERVICE = 'service',
  INVOICE = 'invoice'
}

export interface LogEntry {
  id: string;
  action: string;
  description: string;
  timestamp: string | Date;
  user: string ;
  level: string;
  category: string | LogCategory;
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
