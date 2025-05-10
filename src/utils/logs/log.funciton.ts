import { LogEntry } from '@/pages/AdminLogs/types.ts';
import { logsTable } from '@/integrations/supabase/client.ts';
import { v4 as uuid } from 'uuid';

export async function log(logData: Omit<Omit<LogEntry, 'timestamp'>, 'id'>) {
  const logEntry: LogEntry = Object.assign(logData, {
    id: uuid(),
    timestamp: new Date(),
  });

  await logsTable().insert([logEntry]);
}
