
import { LogEntry, ChartDataItem, WeeklyDataItem } from './types';
import {logsTable} from "@/integrations/supabase/client.ts";

// Mock log data
export const mockLogs: LogEntry[] = (await logsTable().select('*') as any).data as LogEntry[]
// export const mockLogs: LogEntry[] = [
//   {
//     id: '1',
//     action: 'User Registration',
//     description: 'New user registered: client@example.com',
//     timestamp: '2025-04-03T10:15:30Z',
//     user: 'system',
//     level: 'info',
//     category: 'user'
//   },
//   {
//     id: '3',
//     action: 'Email Sent',
//     description: 'Monthly report sent to all clients',
//     timestamp: '2025-04-03T08:30:00Z',
//     user: 'system',
//     level: 'info',
//     category: 'email'
//   },
//   {
//     id: '5',
//     action: 'Service Request',
//     description: 'New HR Management service requested',
//     timestamp: '2025-04-02T16:05:22Z',
//     user: 'client@example.com',
//     level: 'info',
//     category: 'service'
//   },
//   {
//     id: '8',
//     action: 'Invoice Generated',
//     description: 'Monthly invoice #INV-2025-042 generated',
//     timestamp: '2025-04-01T09:00:00Z',
//     user: 'system',
//     level: 'info',
//     category: 'invoice'
//   },
// ];

// Chart data
export const chartData: ChartDataItem[] = [
  { name: 'User', value: 42 },
  { name: 'File', value: 65 },
  { name: 'Email', value: 120 },
  { name: 'Security', value: 15 },
  { name: 'Service', value: 28 },
  { name: 'System', value: 9 },
  { name: 'Invoice', value: 54 },
];

// Weekly data
export const weeklyData: WeeklyDataItem[] = [
  { name: 'Mon', users: 12, files: 19, emails: 35, security: 5 },
  { name: 'Tue', users: 8, files: 22, emails: 42, security: 3 },
  { name: 'Wed', users: 15, files: 14, emails: 28, security: 4 },
  { name: 'Thu', users: 9, files: 10, emails: 32, security: 2 },
  { name: 'Fri', users: 7, files: 18, emails: 25, security: 1 },
  { name: 'Sat', users: 3, files: 5, emails: 12, security: 0 },
  { name: 'Sun', users: 2, files: 4, emails: 8, security: 0 },
];
