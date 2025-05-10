import React, { useEffect, useState } from 'react';
import LogsHeader from './components/LogsHeader';
import LogsContent from './components/LogsContent';
import { chartData, weeklyData } from './mockData';
import { LogEntry } from '@/pages/AdminLogs/types.ts';
import { logsTable } from '@/integrations/supabase/client.ts';

const AdminLogs: React.FC = () => {
  const [mockLogs, setMockLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const logs = ((await logsTable().select('*')) as any).data as LogEntry[];
      setMockLogs(logs);
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <LogsHeader />
      <LogsContent
        logs={mockLogs}
        chartData={chartData}
        weeklyData={weeklyData}
      />
    </div>
  );
};

export default AdminLogs;
